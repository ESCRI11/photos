.PHONY: help install setup export preview-export process-photos check-exiftool clean-build check-pkg-manager check-node

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
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)Setup on New Computer:$(NC)"
	@echo "  1. Install Node.js: $(GREEN)make check-node$(NC)"
	@echo "  2. Install dependencies: $(GREEN)make setup$(NC)"
	@echo "  3. Install photo tools: $(GREEN)make check-exiftool$(NC)"
	@echo ""

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
			echo "$(YELLOW)Upgrade with nvm (recommended):$(NC)"; \
			echo "  $(GREEN)nvm install 22$(NC)"; \
			echo "  $(GREEN)nvm use 22$(NC)"; \
			echo "  $(GREEN)nvm alias default 22$(NC)"; \
			echo ""; \
			echo "$(YELLOW)Or install nvm first:$(NC)"; \
			echo "  $(GREEN)curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash$(NC)"; \
			echo ""; \
			exit 1; \
		else \
			echo "  $(GREEN)✓ Node.js version is compatible!$(NC)"; \
		fi; \
	else \
		echo "  $(RED)✗ Node.js not found!$(NC)"; \
		echo ""; \
		echo "$(YELLOW)Install Node.js from: https://nodejs.org/$(NC)"; \
		exit 1; \
	fi

setup: check-pkg-manager check-node ## Initial setup - install dependencies (run on new computer)
	@echo "$(YELLOW)Installing dependencies with $(PKG_MANAGER)...$(NC)"
	$(PKG_MANAGER) install
	@echo ""
	@echo "$(GREEN)✓ Setup complete!$(NC)"
	@echo ""
	@echo "$(YELLOW)Next steps:$(NC)"
	@echo "  • Install photo tools: $(GREEN)make check-exiftool$(NC)"
	@echo "  • Process photos: $(GREEN)make process-photos$(NC)"
	@echo "  • Export site: $(GREEN)make export$(NC)"
	@echo ""

check-exiftool: ## Check if photo processing tools are installed
	@echo "$(BLUE)Checking photo processing tools:$(NC)"
	@if command -v exiftool >/dev/null 2>&1; then \
		echo "  $(GREEN)✓$(NC) exiftool installed: $$(exiftool -ver)"; \
	else \
		echo "  $(RED)✗$(NC) exiftool not installed"; \
		echo "    Install: $(YELLOW)sudo apt install libimage-exiftool-perl$(NC)"; \
		echo "    Or macOS: $(YELLOW)brew install exiftool$(NC)"; \
	fi
	@if command -v jq >/dev/null 2>&1; then \
		echo "  $(GREEN)✓$(NC) jq installed: $$(jq --version)"; \
	else \
		echo "  $(RED)✗$(NC) jq not installed"; \
		echo "    Install: $(YELLOW)sudo apt install jq$(NC)"; \
		echo "    Or macOS: $(YELLOW)brew install jq$(NC)"; \
	fi

process-photos: ## Process photos from to_proces/ folder
	@echo "$(BLUE)Processing photos from to_proces/ folder...$(NC)"
	@./process-photos-auto.sh

export: check-pkg-manager ## Export static site to /docs directory
	@echo "$(YELLOW)Exporting static site...$(NC)"
	@if [ -s "$$HOME/.nvm/nvm.sh" ]; then \
		bash -c 'export NVM_DIR="$$HOME/.nvm" && [ -s "$$NVM_DIR/nvm.sh" ] && . "$$NVM_DIR/nvm.sh" && $(PKG_MANAGER) run build'; \
	else \
		$(PKG_MANAGER) run build; \
	fi
	@echo "$(GREEN)✓ Static site exported to /docs directory$(NC)"

preview-export: export ## Build and preview the exported site locally
	@echo "$(YELLOW)Setting up preview server...$(NC)"
	@rm -f photos
	@ln -s docs photos
	@echo "$(YELLOW)Starting local server...$(NC)"
	@echo "$(BLUE)Preview at: http://localhost:8000/photos/$(NC)"
	@echo "$(YELLOW)Press Ctrl+C to stop$(NC)"
	@echo ""
	@if command -v python3 >/dev/null 2>&1; then \
		python3 -m http.server 8000; \
	elif command -v python >/dev/null 2>&1; then \
		python -m SimpleHTTPServer 8000; \
	else \
		echo "$(RED)Error: Python not found. Install Python to preview.$(NC)"; \
		exit 1; \
	fi
	@rm -f photos

clean-build: ## Clean build artifacts (keeps node_modules)
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	rm -rf .next
	rm -rf docs
	rm -rf build
	rm -f photos
	rm -f *.tsbuildinfo
	@echo "$(GREEN)✓ Build artifacts cleaned$(NC)"
