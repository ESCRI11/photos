.PHONY: help install dev build start lint clean format check test

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Auto-detect package manager
PKG_MANAGER := $(shell \
	if command -v pnpm >/dev/null 2>&1; then \
		echo "pnpm"; \
	elif command -v yarn >/dev/null 2>&1; then \
		echo "yarn"; \
	elif command -v npm >/dev/null 2>&1; then \
		echo "npm"; \
	else \
		echo "none"; \
	fi)

# Check if a package manager is available
check-pkg-manager:
	@if [ "$(PKG_MANAGER)" = "none" ]; then \
		echo "$(RED)Error: No package manager found (npm, yarn, or pnpm)$(NC)"; \
		echo "$(YELLOW)Please install Node.js from https://nodejs.org/$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)Using package manager: $(PKG_MANAGER)$(NC)"

help: ## Show this help message
	@echo "$(BLUE)Photography Portfolio - Available Commands$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'
	@echo ""

install: check-pkg-manager check-node ## Install dependencies
	@echo "$(YELLOW)Installing dependencies with $(PKG_MANAGER)...$(NC)"
	$(PKG_MANAGER) install

dev: check-pkg-manager ## Start development server
	@echo "$(YELLOW)Starting development server...$(NC)"
	@if [ -s "$$HOME/.nvm/nvm.sh" ]; then \
		bash -c 'export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && . "$$NVM_DIR/nvm.sh" && $(PKG_MANAGER) dev'; \
	else \
		$(PKG_MANAGER) dev; \
	fi

build: check-pkg-manager ## Build the project for production
	@echo "$(YELLOW)Building project...$(NC)"
	@if [ -s "$$HOME/.nvm/nvm.sh" ]; then \
		bash -c 'export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && . "$$NVM_DIR/nvm.sh" && $(PKG_MANAGER) run build'; \
	else \
		$(PKG_MANAGER) run build; \
	fi

start: check-pkg-manager ## Start production server (requires build first)
	@echo "$(YELLOW)Starting production server...$(NC)"
	$(PKG_MANAGER) start

lint: check-pkg-manager ## Run ESLint
	@echo "$(YELLOW)Running linter...$(NC)"
	$(PKG_MANAGER) run lint

lint-fix: check-pkg-manager ## Run ESLint with auto-fix
	@echo "$(YELLOW)Running linter with auto-fix...$(NC)"
	$(PKG_MANAGER) run lint --fix

clean: ## Clean build artifacts and dependencies
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	rm -rf .next
	rm -rf out
	rm -rf build
	rm -rf node_modules
	rm -rf .pnpm-store
	rm -f pnpm-lock.yaml
	rm -f yarn.lock
	rm -f package-lock.json
	rm -f *.tsbuildinfo

clean-build: ## Clean only build artifacts (keep node_modules)
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	rm -rf .next
	rm -rf out
	rm -rf build
	rm -f *.tsbuildinfo

format: check-pkg-manager ## Format code (requires prettier to be installed)
	@echo "$(YELLOW)Formatting code...$(NC)"
	@if command -v prettier >/dev/null 2>&1; then \
		$(PKG_MANAGER) exec prettier --write "**/*.{js,jsx,ts,tsx,json,css,md}"; \
	else \
		echo "Prettier not found. Run: $(PKG_MANAGER) add -D prettier"; \
	fi

check: lint ## Run all checks (lint)
	@echo "$(GREEN)All checks passed!$(NC)"

rebuild: clean install build ## Clean, install dependencies, and build

setup: install ## Initial setup - install dependencies
	@echo "$(GREEN)Setup complete! Run 'make dev' to start development server.$(NC)"

prod: build start ## Build and start production server

update: check-pkg-manager ## Update dependencies
	@echo "$(YELLOW)Updating dependencies...$(NC)"
	$(PKG_MANAGER) update

outdated: check-pkg-manager ## Check for outdated dependencies
	@echo "$(YELLOW)Checking for outdated dependencies...$(NC)"
	$(PKG_MANAGER) outdated

audit: check-pkg-manager ## Run security audit
	@echo "$(YELLOW)Running security audit...$(NC)"
	$(PKG_MANAGER) audit

export: check-pkg-manager ## Export static site to /out directory
	@echo "$(YELLOW)Exporting static site...$(NC)"
	@if [ -s "$$HOME/.nvm/nvm.sh" ]; then \
		bash -c 'export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && . "$$NVM_DIR/nvm.sh" && $(PKG_MANAGER) run build'; \
	else \
		$(PKG_MANAGER) run build; \
	fi
	@echo "$(GREEN)✓ Static site exported to /out directory$(NC)"

preview-export: export ## Build and preview the exported static site
	@echo "$(YELLOW)Starting local server for static export...$(NC)"
	@if command -v python3 >/dev/null 2>&1; then \
		cd out && python3 -m http.server 8000; \
	elif command -v python >/dev/null 2>&1; then \
		cd out && python -m SimpleHTTPServer 8000; \
	else \
		echo "$(RED)Error: Python not found. Install Python or use another static server.$(NC)"; \
		exit 1; \
	fi

deploy-check: ## Check if ready for GitHub Pages deployment
	@echo "$(BLUE)GitHub Pages Deployment Checklist:$(NC)"
	@echo ""
	@echo "$(YELLOW)1. Repository Setup:$(NC)"
	@if git rev-parse --git-dir > /dev/null 2>&1; then \
		echo "   $(GREEN)✓$(NC) Git repository initialized"; \
		if git remote get-url origin > /dev/null 2>&1; then \
			REMOTE_URL=$$(git remote get-url origin); \
			echo "   $(GREEN)✓$(NC) Remote origin: $$REMOTE_URL"; \
		else \
			echo "   $(RED)✗$(NC) No remote origin set"; \
			echo "     Run: git remote add origin <your-repo-url>"; \
		fi; \
	else \
		echo "   $(RED)✗$(NC) Not a git repository"; \
		echo "     Run: git init"; \
	fi
	@echo ""
	@echo "$(YELLOW)2. GitHub Pages Configuration:$(NC)"
	@echo "   • Go to your GitHub repo → Settings → Pages"
	@echo "   • Source: GitHub Actions"
	@echo ""
	@echo "$(YELLOW)3. Workflow File:$(NC)"
	@if [ -f .github/workflows/deploy.yml ]; then \
		echo "   $(GREEN)✓$(NC) .github/workflows/deploy.yml exists"; \
	else \
		echo "   $(RED)✗$(NC) Workflow file missing"; \
	fi
	@echo ""
	@echo "$(YELLOW)4. Static Export Test:$(NC)"
	@if [ -d out ]; then \
		echo "   $(GREEN)✓$(NC) /out directory exists"; \
		echo "     Preview with: $(GREEN)make preview-export$(NC)"; \
	else \
		echo "   $(YELLOW)!$(NC) Run: $(GREEN)make export$(NC) to generate /out directory"; \
	fi
	@echo ""
	@echo "$(BLUE)Next Steps:$(NC)"
	@echo "  1. Test locally: $(GREEN)make export && make preview-export$(NC)"
	@echo "  2. Commit changes: $(GREEN)git add . && git commit -m 'Setup GitHub Pages'$(NC)"
	@echo "  3. Push to GitHub: $(GREEN)git push origin main$(NC)"
	@echo "  4. Enable GitHub Pages in repo settings (Source: GitHub Actions)"
	@echo ""

info: ## Show project information
	@echo "$(BLUE)Project Information:$(NC)"
	@echo "  Name: my-v0-project"
	@echo "  Version: 0.1.0"
	@echo "  Framework: Next.js 16.0.0"
	@echo "  Package Manager: $(PKG_MANAGER) (auto-detected)"
	@echo "  React: 19.2.0"
	@echo "  Deployment: GitHub Pages (static export)"
	@echo ""
	@echo "$(BLUE)Available Scripts:$(NC)"
	@echo "  dev     - Start development server (http://localhost:3000)"
	@echo "  build   - Build for production"
	@echo "  start   - Start production server"
	@echo "  lint    - Run ESLint"
	@echo "  export  - Export static site for GitHub Pages"
	@echo ""
	@echo "$(BLUE)Note:$(NC) This Makefile auto-detects your package manager (pnpm, yarn, or npm)"

install-pnpm: ## Install pnpm globally
	@echo "$(YELLOW)Installing pnpm globally...$(NC)"
	@if command -v npm >/dev/null 2>&1; then \
		npm install -g pnpm; \
		echo "$(GREEN)pnpm installed successfully!$(NC)"; \
	else \
		echo "$(RED)Error: npm not found. Please install Node.js first.$(NC)"; \
		exit 1; \
	fi

check-node: ## Check Node.js version and requirements
	@echo "$(BLUE)Node.js Version Check:$(NC)"
	@echo "  Required: >= 20.9.0"
	@if command -v node >/dev/null 2>&1; then \
		NODE_VERSION=$$(node --version | cut -d'v' -f2); \
		echo "  Installed: $$NODE_VERSION"; \
		MAJOR_VERSION=$$(echo $$NODE_VERSION | cut -d'.' -f1); \
		if [ "$$MAJOR_VERSION" -lt 20 ]; then \
			echo ""; \
			echo "$(RED)⚠️  Your Node.js version is too old!$(NC)"; \
			echo ""; \
			echo "$(YELLOW)Upgrade options:$(NC)"; \
			echo "  1. Using nvm (recommended):"; \
			echo "     $(GREEN)nvm install 22$(NC)"; \
			echo "     $(GREEN)nvm use 22$(NC)"; \
			echo "     $(GREEN)nvm alias default 22$(NC)"; \
			echo ""; \
			echo "  2. Install nvm if you don't have it:"; \
			echo "     $(GREEN)curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash$(NC)"; \
			echo "     Then restart your terminal and run: $(GREEN)make check-node$(NC)"; \
			echo ""; \
			echo "  3. Or download directly from:"; \
			echo "     https://nodejs.org/ (LTS version)"; \
			exit 1; \
		else \
			echo "  $(GREEN)✓ Node.js version is compatible!$(NC)"; \
		fi; \
	else \
		echo "  $(RED)✗ Node.js not found!$(NC)"; \
		echo ""; \
		echo "$(YELLOW)Please install Node.js:$(NC)"; \
		echo "  https://nodejs.org/"; \
		exit 1; \
	fi

versions: ## Show all installed versions
	@echo "$(BLUE)Installed Versions:$(NC)"
	@if command -v node >/dev/null 2>&1; then \
		echo "  Node.js: $$(node --version)"; \
	else \
		echo "  Node.js: $(RED)not installed$(NC)"; \
	fi
	@if command -v npm >/dev/null 2>&1; then \
		echo "  npm: $$(npm --version)"; \
	else \
		echo "  npm: $(RED)not installed$(NC)"; \
	fi
	@if command -v pnpm >/dev/null 2>&1; then \
		echo "  pnpm: $$(pnpm --version)"; \
	else \
		echo "  pnpm: not installed"; \
	fi
	@if command -v yarn >/dev/null 2>&1; then \
		echo "  yarn: $$(yarn --version)"; \
	else \
		echo "  yarn: not installed"; \
	fi
	@if command -v nvm >/dev/null 2>&1; then \
		echo "  nvm: installed"; \
	else \
		echo "  nvm: not installed"; \
	fi
	@echo ""
	@echo "$(BLUE)Package Manager:$(NC) $(PKG_MANAGER)"

