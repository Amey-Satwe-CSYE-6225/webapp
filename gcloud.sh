IMAGE_NAME=$(cat packer_image_name.txt)
echo $IMAGE_NAME
gcloud secrets versions access 1 --secret=webapp_secret --out-file=secret.json --format='value(payload.data)'

METADATA_STARTUP_SCRIPT=$(cat "secret.json" | jq -r '.metadata_startup_script')
KMS_KEY_ID=$(cat "secret.json" | jq -r '.kms_key_id')

ts=$(date +%Y%m%d%H%M)

gcloud compute instance-templates create webapp-from-git-$ts --instance-template-region="us-east1" --tags="webapp" --machine-type="n2-standard-2" --region="us-east1" --network-interface=network="cloud-demo-vpc",no-address,subnet="webapp" --service-account=csye-demo-service-account@csye-6225-demo-413900.iam.gserviceaccount.com --scopes=https://www.googleapis.com/auth/cloud-platform --tags=load-balanced-backend,csye-6225 --maintenance-policy="MIGRATE" --image-project="csye-6225-demo-413900" --image=$IMAGE_NAME --boot-disk-type="pd-standard" --boot-disk-kms-key=$KMS_KEY_ID --metadata=startup-script="$METADATA_STARTUP_SCRIPT"

gcloud compute instance-groups managed rolling-action start-update webapp-manager --version="template=projects/csye-6225-demo-413900/regions/us-east1/instanceTemplates/webapp-from-git-$ts" --region="us-east1"

gcloud compute instance-groups managed wait-until webapp-manager \
    --version-target-reached --region="us-east1"
