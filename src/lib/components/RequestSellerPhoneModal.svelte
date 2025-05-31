<script lang="ts">
  import type { AuthValidateResponse, ReceiptResponse, DecryptResponse } from '$lib/types/property.ts';

  let { property, close, apiUrl, modListingId } = $props();

  const ttl = 60 * 1000; // 5 minutes

  let phoneNumber = $state('');
  let otp = $state('');
  let sellerPhone = $state('');
  let isShowButtonCallSeller = $state(false)
  let isValidateOtp = $state(false)
  let resendCooldown = $state(0); // seconds remaining before resend is allowed
  let resendInterval: number | undefined; // store the interval ID
  let otpToken = $state(localStorage.getItem('otpToken') ?? '');
  let otpTokenExpiresAt = $state(Number(localStorage.getItem('otpTokenExpiresAt') ?? 0));

  let phoneError = $state('');
  let otpError = $state('');

  function checkOtpTokenValidity() {
    const token = otpToken;
    const expiresAt = Number(otpTokenExpiresAt); // better naming

    console.log('check token valid', token, expiresAt, Date.now());
    
    const isValid = token && expiresAt && Date.now() < expiresAt;

    if (!isValid) {
        localStorage.removeItem('otpToken');
        localStorage.removeItem('otpTokenExpiresAt');
        otpToken = '';
        otpTokenExpiresAt = 0;
    }

    return isValid;
  }

  function startResendCooldown() {
    resendCooldown = 60;
    clearInterval(resendInterval);

    resendInterval = window.setInterval(() => {
      resendCooldown -= 1;

      if (resendCooldown <= 0) {
        clearInterval(resendInterval);
      }
    }, 1000);
  }

  async function me() {
    const response = await fetch(apiUrl.me, {
			method: 'GET',
			headers: {
				'authorization': `Bearer ${otpToken}`
			}
		});

    if (response.ok) {
      isShowButtonCallSeller = true;
    } else {
      isShowButtonCallSeller = false;
    }
  }

  async function auth() {
    if (!phoneNumber.trim()) {
      phoneError = 'Nomor WhatsApp tidak boleh kosong';
      return;
    }

    phoneError = '';

    const payload = new URLSearchParams({ phone: phoneNumber });
    const response = await fetch(apiUrl.auth, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString()
    });

    if (response.ok) {
      const data = await response.json();
      console.log('success response auth', data);
      isValidateOtp = true
    } else {
      const errorData = await response.json(); // or response.json(), if API returns structured error
	    phoneError = errorData.error ?? 'Unexpected unknown error';
    }
  }

  async function resendOtp() {
    if (resendCooldown > 0) return;

    await auth(); // reuse the auth function to resend
    startResendCooldown();
  }

  async function validate() {
    if (!otp.trim()) return otpError = 'Kode OTP tidak boleh kosong';
    otpError = '';

    try {
      // Hit validate otp
      const payload = new URLSearchParams({ phone: phoneNumber, otp });
      const res = await fetch(apiUrl.validate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString(),
      });

      const data = await res.json();

      if (res.ok && data?.token) {
        const expiresAt = Date.now() + ttl;
        localStorage.setItem('otpToken', data.token);
        localStorage.setItem('otpTokenExpiresAt', String(expiresAt));

        otpToken = data.token;
        otpTokenExpiresAt = expiresAt;
      } else {
        otpError = data?.error ?? 'Unexpected unknown error';
      }

      // Hit receipt
      const receiptPayload = new URLSearchParams({
        encryptedContact: property.registrant.phoneNumberEncrypted,
        listingId: modListingId,
        referrerId: 'localhost'
      });

      const receiptRes = await fetch(apiUrl.receipt, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${otpToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: receiptPayload.toString()
      });

      const receiptData: ReceiptResponse = await receiptRes.json();
      // console.log('receiptData', receiptData);

      // Hit decrypt
      const decryptPayload = new URLSearchParams(
        Object.fromEntries(
          Object.entries({ ...receiptData.receipt, signature: receiptData.signature })
            .filter(([_, v]) => v !== undefined && v !== null)
            .map(([k, v]) => [k, String(v)])
        )
      );

      const decryptRes = await fetch(apiUrl.decrypt, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${otpToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: decryptPayload.toString()
      });

      const decryptData: DecryptResponse = await decryptRes.json();
      // console.log('decryptData', decryptData);

      sellerPhone = decryptData.decryptedContact || '';
      isShowButtonCallSeller = true;
      isValidateOtp = false;
    } catch (e: any) {
      otpError = e?.message ?? 'Unexpected unknown error';
      isShowButtonCallSeller = false;
      isValidateOtp = true;
    }
  }

  $effect(() => {
    checkOtpTokenValidity();
    me();
	});
</script>

<div class="login-and-register-form modal show d-block" onclick={close} role="presentation">
  <div class="main-register-holder" role="presentation" onclick={(e) => e.stopPropagation()}>
    <div class="main-register fl-wrap p-4" style="max-width: 500px; border-radius: 10px; background: #fff;">
      <div class="close-reg" role="presentation" onclick={close}>
        <i class="fa fa-times"></i>
      </div>

      <!-- ✅ Title + Icon -->
      <div class="d-flex align-items-center mb-3">
        <img src="/images/logo-moruma.jpeg" alt="Logo" width="40" height="40" class="me-2" />
        <h4 class="m-0 fw-semibold">Moruma</h4>
      </div>

      <!-- ✅ Property image + address -->
      <div class="d-flex align-items-start mb-3">
        <img src={property.pictureUrls[0]} alt="Property" width="70" height="70" class="me-3 rounded mr-3" />
        <p class="m-0 fw-medium">{property.address || ''}</p>
      </div>

      <!-- ✅ Form Text -->
      <p class="mb-2">
        Untuk dihubungkan ke pemilik listing, masukkan nomor WhatsApp anda:
      </p>

      {#if phoneError}
        <div class="alert alert-danger text-danger mb-3">{phoneError}</div>
      {/if}

      {#if otpError}
        <div class="alert alert-danger text-danger mb-3">{otpError}</div>
      {/if}

      <!-- ✅ Input -->
      {#if (!isValidateOtp && !isShowButtonCallSeller)}
        <input
          type="text"
          class="form-control mb-3"
          placeholder="Nomor WhatsApp"
          bind:value={phoneNumber}
        />

        <button type="button" class="btn btn-primary w-100 fw-bold" style="border-color: white;" onclick={auth}>
          Lanjut: Kirim OTP
        </button>
      {/if}

      {#if isValidateOtp && !isShowButtonCallSeller}
        <input
          type="text"
          class="form-control mb-3"
          placeholder="Masukkan Kode OTP"
          bind:value={otp}
        />

        <button class="btn btn-primary w-100 fw-bold" style="border-color: white;" onclick={validate}>
          Lanjut: Validasi OTP
        </button>

        <button
          type="button"
          class="btn btn-primary w-100 fw-bold mt-3"
          style="border-color: white;"
          onclick={resendOtp}
          disabled={resendCooldown > 0}
        >
          {resendCooldown > 0 ? `Tunggu ${resendCooldown}s` : 'Kirim Ulang Kode OTP'}
        </button>
      {/if}

      {#if isShowButtonCallSeller}
        <button
          type="button"
          class="btn w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
          style="background: rgb(34, 197, 94); background-color: rgb(34, 197, 94); border-color: rgb(34, 197, 94); color: white;"
          onclick={auth}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M16.75 13.96c.25.13.41.2.46.3.06.11.04.61-.21 1.18-.2.56-1.24 1.1-1.7 1.12-.46.02-.47.36-2.96-.73-2.49-1.09-3.99-3.75-4.11-3.92-.12-.17-.96-1.38-.92-2.61.05-1.22.69-1.8.95-2.04.24-.26.51-.29.68-.26h.47c.15 0 .36-.06.55.45l.69 1.87c.06.13.1.28.01.44l-.27.41-.39.42c-.12.12-.26.25-.12.5.12.26.62 1.09 1.32 1.78.91.88 1.71 1.17 1.95 1.3.24.14.39.12.54-.04l.81-.94c.19-.25.35-.19.58-.11l1.67.88zM12 2a10 10 0 1 1 0 20c-1.97 0-3.8-.57-5.35-1.55L2 22l1.55-4.65A9.969 9.969 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8c0 1.72.54 3.31 1.46 4.61L4.5 19.5l2.89-.96A7.95 7.95 0 0 0 12 20a8 8 0 0 0 8-8 8 8 0 0 0-8-8z" />
          </svg>
          {sellerPhone}
        </button>

      {/if}
    </div>
  </div>
</div>
