variable "project_id" {
  description = "Google Cloud project ID"
}

variable "zone" {
  description = "Default zone for the custom image"
}

variable "source_image_family" {
  description = "Source image family for the custom image"
}

variable "ssh_username" {
  description = "SSH username for connecting to the custom image"
}

variable "disk_type" {
  type    = string
  default = "pd-standard"
}
variable "disk_size" {
  type    = number
  default = 20
}
variable "image_name" {
  type = string
}
variable "image_family" {
  type = string
}

packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = ">= 1.0.0"
    }
  }
}

source "googlecompute" "webapp-csye-custom-image" {
  project_id              = var.project_id
  source_image_family     = var.source_image_family
  zone                    = var.zone
  disk_size               = var.disk_size
  disk_type               = var.disk_type
  image_name              = "${var.image_name}-{{timestamp}}"
  image_description       = "webapp custom image for CSYE 6225"
  image_family            = var.image_family
  image_project_id        = var.project_id
  image_storage_locations = ["us"]
  ssh_username            = var.ssh_username
}

build {
  sources = [
    "sources.googlecompute.webapp-csye-custom-image"
  ]
  provisioner "file" {
    source      = "webapp.zip"
    destination = "/tmp/"
  }
  provisioner "file"{
    source = "config.yaml"
    destination = "/tmp/"
  }
  provisioner "shell" {
    scripts = ["install_deps.sh", "systemd.sh","ops_agent.sh"]
  }
}
