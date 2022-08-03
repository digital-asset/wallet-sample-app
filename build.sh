cd main/User
daml build -o user.dar
echo "User dar file built"

cd ../Asset
daml build -o asset.dar
echo "Asset dar file built"

cd ../Account
daml build -o account.dar
daml build -o setup.dar

echo "Account dar file built"
echo "Setup dar file built"


cd ../../triggers
daml build -o triggers.dar
echo "Triggers dar file built"
echo "Completed building dar files"
