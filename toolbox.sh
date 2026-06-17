#!/bin/bash

# HKGD Toolbox - Linux Version
# Main management script for HKGD project
# Features: SSL certs, admin password, domain, server control

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
API_DIR="$SCRIPT_DIR/api"
CERTS_DIR="$FRONTEND_DIR/certs"
API_CERTS_DIR="$API_DIR/certs"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

press_any_key() {
    echo ""
    read -n 1 -s -r -p "Press any key to continue..."
    echo ""
}

show_menu() {
    clear
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║              HKGD Toolbox - Main Menu                   ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}[1]${NC} Update SSL Certificates    - Copy Let's Encrypt certs to project"
    echo -e "${BLUE}[2]${NC} Update Admin Password      - Change the admin login password"
    echo -e "${BLUE}[3]${NC} Update Domain/Host        - Change the allowed domain for HMR"
    echo -e "${BLUE}[4]${NC} Install Dependencies      - npm install for frontend & API"
    echo -e "${BLUE}[5]${NC} Start Dev Server          - Run Vite dev server (port 5173)"
    echo -e "${BLUE}[6]${NC} Start Production Server   - Run Node API server (port 8081)"
    echo -e "${BLUE}[7]${NC} Kill Process              - Kill processes on port 8081 or 5173"
    echo -e "${BLUE}[8]${NC} Toggle April Fools Prank  - Enable/disable the prank page"
    echo -e "${RED}[9]${NC} Exit"
    echo ""
    echo -n "Select option: "
}

update_certs() {
    echo ""
    echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  Update SSL Certificates${NC}"
    echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
    echo "This will copy Let's Encrypt certificates to the project."
    echo "Source: /etc/letsencrypt/live/<domain>/"
    echo "Target: frontend/certs/ and api/certs/"
    echo ""
    echo -n "Enter Let's Encrypt domain (e.g., hkgdl.ddns.net): "
    read DOMAIN
    
    if [ ! -f "/etc/letsencrypt/live/$DOMAIN/privkey.pem" ]; then
        echo -e "${RED}Error: Certificate not found at /etc/letsencrypt/live/$DOMAIN/${NC}"
        press_any_key
        return
    fi
    
    mkdir -p "$CERTS_DIR" "$API_CERTS_DIR"
    
    echo "Copying certificates to frontend/certs/..."
    sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" "$CERTS_DIR/key.pem"
    sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "$CERTS_DIR/cert.pem"
    
    echo "Copying certificates to api/certs/..."
    sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" "$API_CERTS_DIR/key.pem"
    sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "$API_CERTS_DIR/cert.pem"
    
    sudo chmod 644 "$CERTS_DIR"/*.pem "$API_CERTS_DIR"/*.pem 2>/dev/null
    
    echo ""
    echo -e "${GREEN}✓ Certificates updated successfully!${NC}"
    echo "  - Frontend: $CERTS_DIR"
    echo "  - API: $API_CERTS_DIR"
    press_any_key
}

update_password() {
    echo ""
    echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  Update Admin Password${NC}"
    echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
    echo "This will change the admin password in api/.env file."
    echo "Used for authenticating admin operations."
    echo ""
    echo -n "Enter new admin password: "
    read -s NEW_PASSWORD
    echo ""
    
    if [ -f "$API_DIR/.env" ]; then
        sed -i "s/ADMIN_PASSWORD=.*/ADMIN_PASSWORD=$NEW_PASSWORD/" "$API_DIR/.env"
        echo ""
        echo -e "${GREEN}✓ Admin password updated successfully!${NC}"
    else
        echo -e "${RED}Error: .env file not found at $API_DIR/.env${NC}"
    fi
    press_any_key
}

update_domain() {
    echo ""
    echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  Update Domain/Host${NC}"
    echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
    echo "This will update the allowed hosts and HMR host in vite.config.ts."
    echo "Required for Hot Module Replacement to work with custom domain."
    echo ""
    echo -n "Enter new domain (e.g., hkgdl.ddns.net): "
    read NEW_DOMAIN
    
    # Update vite.config.ts
    if [ -f "$FRONTEND_DIR/vite.config.ts" ]; then
        sed -i "s/allowedHosts: \['[^']*', 'localhost'\]/allowedHosts: ['$NEW_DOMAIN', 'localhost']/" "$FRONTEND_DIR/vite.config.ts"
        sed -i "s/host: '[^']*',/host: '$NEW_DOMAIN',/" "$FRONTEND_DIR/vite.config.ts"
        sed -i "s/hmr: {/hmr: {\n      host: '$NEW_DOMAIN',/" "$FRONTEND_DIR/vite.config.ts"
        echo ""
        echo -e "${GREEN}✓ Domain updated to $NEW_DOMAIN${NC}"
    else
        echo -e "${RED}Error: vite.config.ts not found${NC}"
    fi
    press_any_key
}

install_deps() {
    echo ""
    echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  Install Dependencies${NC}"
    echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
    echo "This will install npm packages for both frontend and API."
    echo ""
    
    echo "Installing frontend dependencies..."
    cd "$FRONTEND_DIR" && npm install
    echo ""
    
    echo "Installing API dependencies..."
    cd "$API_DIR" && npm install
    echo ""
    
    echo -e "${GREEN}✓ Dependencies installed successfully!${NC}"
    press_any_key
}

start_dev() {
    echo ""
    echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  Start Development Server${NC}"
    echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
    echo "Starting Vite development server (frontend only)..."
    echo "The dev server proxies /api requests to localhost:8081"
    echo "Make sure the API server is running separately!"
    echo ""
    echo "Frontend URL: https://localhost:5173"
    echo "API should be running on: https://localhost:8081"
    echo ""
    cd "$FRONTEND_DIR" && npm run dev &
    sleep 2
    echo ""
    echo -e "${GREEN}✓ Dev server started!${NC}"
    press_any_key
}

start_prod() {
    echo ""
    echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  Start Production Server${NC}"
    echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
    echo "Starting Node.js API server..."
    echo "URL: https://localhost:8081"
    echo ""
    cd "$API_DIR" && npm start &
    sleep 2
    echo ""
    echo -e "${GREEN}✓ Production server started!${NC}"
    press_any_key
}

kill_process() {
    echo ""
    echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  Kill Process${NC}"
    echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
    echo "This will kill processes running on port 8081 and 5173."
    echo ""
    
    echo "Checking port 8081 (API)..."
    if lsof -ti:8081 >/dev/null 2>&1; then
        echo "Killing process on port 8081..."
        sudo lsof -ti:8081 | xargs kill -9 2>/dev/null
        echo -e "${GREEN}✓ Port 8081 freed${NC}"
    else
        echo "No process on port 8081"
    fi
    
    echo ""
    echo "Checking port 5173 (Frontend)..."
    if lsof -ti:5173 >/dev/null 2>&1; then
        echo "Killing process on port 5173..."
        sudo lsof -ti:5173 | xargs kill -9 2>/dev/null
        echo -e "${GREEN}✓ Port 5173 freed${NC}"
    else
        echo "No process on port 5173"
    fi
    
    echo ""
    echo -e "${GREEN}✓ Done!${NC}"
    press_any_key
}

toggle_prank() {
    echo ""
    echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  Toggle April Fools Prank${NC}"
    echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
    echo "This will enable or disable the April Fools prank page."
    echo ""
    
    PRANK_FILE="$FRONTEND_DIR/src/components/AprilFoolsPrank.tsx"
    PRANK_DISABLED="$FRONTEND_DIR/src/components/AprilFoolsPrank.tsx.disabled"
    
    # Check if prank is currently disabled (file has only passthrough)
    if [ -f "$PRANK_FILE" ] && grep -q "// Prank disabled" "$PRANK_FILE"; then
        # Currently disabled, enable it
        if [ -f "$PRANK_DISABLED" ]; then
            mv "$PRANK_DISABLED" "$PRANK_FILE"
            echo -e "${GREEN}✓ Prank ENABLED!${NC}"
            echo "Users will see the maintenance prank page."
        else
            echo -e "${RED}Error: Disabled prank backup not found${NC}"
        fi
    elif [ -f "$PRANK_DISABLED" ]; then
        # Backup exists, restore it
        mv "$PRANK_DISABLED" "$PRANK_FILE"
        echo -e "${GREEN}✓ Prank ENABLED!${NC}"
        echo "Users will see the maintenance prank page."
    elif [ -f "$PRANK_FILE" ]; then
        # Currently enabled, disable it by creating passthrough
        mv "$PRANK_FILE" "$PRANK_DISABLED"
        cat > "$PRANK_FILE" << 'EOF'
// Prank disabled - just pass through children
export function AprilFoolsPrank({ children }: { children: React.ReactNode }) {
  return children;
}
EOF
        echo -e "${GREEN}✓ Prank DISABLED!${NC}"
        echo "Users will see the normal website."
    else
        echo -e "${RED}Error: Prank file not found${NC}"
    fi
    press_any_key
}

while true; do
    show_menu
    read choice
    case $choice in
        1) update_certs ;;
        2) update_password ;;
        3) update_domain ;;
        4) install_deps ;;
        5) start_dev ;;
        6) start_prod ;;
        7) kill_process ;;
        8) toggle_prank ;;
        9) exit 0 ;;
        *) echo "Invalid option" ;;
    esac
done
