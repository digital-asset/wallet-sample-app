# https://stackoverflow.com/questions/2379829/while-loop-to-test-if-a-file-exists-in-bash

cantonPortFile="./canton-sandbox-port.txt"
jsonApiPortFile="./json-api-port.txt"

# After 20 seconds the loop will exit
timeout=20

rmCantonPortFile(){
  echo "Checking canton port file"
  if [ -f "$cantonPortFile" ]; then
    rm "$cantonPortFile"
    echo "Removed canton port file"
  fi
  echo "Checking server port file"
  if [ -f "$jsonApiPortFile" ]; then
    rm "$jsonApiPortFile"
    echo "Removed canton port file"
  fi

}

runSandbox(){
  daml sandbox --dar main/Asset/asset.dar --dar main/User/user.dar --dar main/Account/account.dar --port-file ${cantonPortFile}
}

startJsonApiServer(){
  echo "Starting Json api server"
  daml json-api --config json-api-app.conf
}

waitForSandBox(){
  while [ ! -f "$cantonPortFile" ];
    do
      echo "Setting up sandbox..."
      if [ "$timeout" == 0 ]; then
        echo "ERROR: Timeout while waiting for the file ${cantonPortFile}"
        exit 1
      sleep 2 # or less like 0.2
      fi
      sleep 1
      ((timeout--))
    done
  echo "Canton sandBox setup complete"
}

waitForServer(){
  while [ ! -f "$jsonApiPortFile" ];
    do
      echo "WAITING FOR SERVER"
      if [ "$timeout" == 0 ]; then
        echo "ERROR: Timeout while waiting for server file."
        exit 1
      sleep 2 # or less like 0.2
      fi
      sleep 5
      ((timeout--))
    done
  echo "Triggers Running"
}

addParties(){
  echo "Adding Parties"
	daml script --dar ./main/Account/account.dar --script-name Setup:setup --ledger-host localhost --ledger-port 6865
  echo "Parties added"
}

startSendAssetHoldingAccountInviteTrigger(){
  echo "Starting Trigger 1"
    daml trigger --dar triggers/triggers.dar \
            --trigger-name SendAssetHoldingAccountInviteTrigger:sendAssetHoldingAccountInviteTrigger \
            --ledger-host localhost \
            --ledger-port 6865 \
            --ledger-user "admin"
}

startAcceptAirdropRequestTrigger(){
  echo "Starting Trigger 2"
  daml trigger --dar triggers/triggers.dar \
             --trigger-name AcceptAirdropRequestTrigger:acceptAirdropRequestTrigger \
             --ledger-host localhost \
             --ledger-port 6865 \
             --ledger-user "admin" 
}

startAcceptAssetInviteTrigger(){
  echo "Starting Trigger 3"
  daml trigger --dar triggers/triggers.dar \
             --trigger-name AcceptAssetInviteTrigger:acceptAssetInviteTrigger \
             --ledger-host localhost \
             --ledger-port 6865 \
             --ledger-user "admin"
}

startAcceptSwapTrigger(){
  echo "Starting Trigger 4"
  daml trigger --dar triggers/triggers.dar \
             --trigger-name AcceptSwapTrigger:acceptSwapTrigger \
             --ledger-host localhost \
             --ledger-port 6865 \
             --ledger-user "admin"
}

cleanup() {
  echo "cleaning up..."
  rmCantonPortFile
  # Our cleanup code goes here
}

startTriggers(){
  echo "Starting triggers"
  startSendAssetHoldingAccountInviteTrigger &
  startAcceptAirdropRequestTrigger &
  startAcceptSwapTrigger &
  startAcceptAssetInviteTrigger &
}

# trap "echo signal received!" SIGINT
trap 'trap " " SIGTERM; kill 0; wait; cleanup;' SIGINT SIGTERM

rmCantonPortFile && 
(runSandbox & waitForSandBox) && addParties && 
(startJsonApiServer & waitForServer ) &&  
(startSendAssetHoldingAccountInviteTrigger &
  startAcceptAirdropRequestTrigger &
  startAcceptSwapTrigger &
  startAcceptAssetInviteTrigger) &
wait


# Check if process is running, run the below:
# ps aux | grep "daml json"


# https://superuser.com/questions/1653229/when-pressed-ctrlc-only-break-out-of-current-function-and-not-whole-bash-script
# https://linuxconfig.org/how-to-propagate-a-signal-to-child-processes-from-a-bash-script
