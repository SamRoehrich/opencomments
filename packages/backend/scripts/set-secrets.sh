#!/bin/bash
# Script to set Cloudflare Worker secrets from .env file

set -e

ENV_FILE="${1:-./.env}"
ENVIRONMENT="${2:-production}"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: .env file not found at $ENV_FILE"
  exit 1
fi

echo "Setting secrets from $ENV_FILE for environment: $ENVIRONMENT"
echo ""

# Read .env file and set secrets
while IFS='=' read -r key value; do
  # Skip empty lines and comments
  [[ -z "$key" || "$key" =~ ^#.*$ ]] && continue
  
  # Remove quotes from value if present
  value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
  
  # Skip if value is empty
  [[ -z "$value" ]] && continue
  
  echo "Setting secret: $key"
  echo "$value" | npx wrangler secret put "$key" --env "$ENVIRONMENT"
done < "$ENV_FILE"

echo ""
echo "✅ All secrets set successfully!"

