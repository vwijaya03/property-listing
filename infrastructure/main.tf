# Terraform main.tf
resource "null_resource" "deploy_to_existing_vps" {
  provisioner "local-exec" {
    command = "ansible-playbook -i '${var.vps_ip},' --private-key $SSH_KEY_PATH --user ubuntu playbook.yml"
  }
}

variable "vps_ip" {
  default = "47.130.15.129"
}