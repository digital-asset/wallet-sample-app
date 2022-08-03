# Deletes all locally built files
echo "Removing dar files..."
cd main/Account && rm -f -r .daml && rm -f *.dar
cd ../Asset && rm -f -r .daml && rm -f *.dar 
cd ../User && rm -f -r .daml && rm -f *.dar 
cd ../../triggers && rm -f -r .daml && rm -f *.dar
cd ../ui
echo "Removing Node modules. This could take a while. Please wait..."
rm -f -r node_modules 
echo "Remiving UI build files..."
rm -f -r build 
echo "Removing daml.js"
rm -r -f daml.js 
cd ..