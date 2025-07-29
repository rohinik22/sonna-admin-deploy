#!/bin/bash
echo "Stopping Sonna Admin Backend API..."
echo

cd "/e/sonna-admin-deploy"
supabase stop

echo
echo "Backend API stopped successfully!"
echo
read -p "Press any key to continue..."
