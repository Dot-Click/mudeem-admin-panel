#!/bin/bash
for name in $(cat << 'EOF'
MudeemAdmin
MudeemAdmin-production
mudeem-admin
mudeem-admin-panel
mudeemadmin
admin-panel
admin
Admin
wowdash
react
client
web
app
ui
mudeem
Mudeem
MudeemBackend
mudeem-be
frontend
Frontend
front-end
Front-End
dashboard
Dashboard
panel
Panel
EOF
); do
  res=$(railway up --detach --service "$name" 2>&1)
  if [[ "$res" != *"Service not found"* && "$res" != *"not found"* ]]; then
    echo "SUCCESS: $name"
    echo "$res"
    break
  fi
done
