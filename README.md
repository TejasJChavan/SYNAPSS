# SYNAPSS - Symptom Nature and Profile Scale for Schizophrenia

Psychology assessment application for evaluating schizophrenia symptoms using the SYNAPSS scale.

To download the portable executable - https://drive.google.com/drive/folders/1I2LQ4Ww-L2gUls_ZQTfZsNHrX80hwEbs?usp=sharing

## Features

- Patient management and search
- Assessment recording with domain-specific options
- Results visualization with radar charts
- Assessment history tracking
- Local database storage (JSON-based)

## Setup

### Requirements
- Node.js (v16 or higher)
- npm

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev    # Starts Vite dev server (in one terminal)
npm start      # Starts Electron (in another terminal)

# Build for production
npm run build

# Create executable
npm run dist
```

## Project Structure

- `src/` - Source code
  - `components/` - React components
  - `data/` - Domain definitions and options
  - `services/` - Database service
- `main.js` - Electron main process
- `preload.js` - Electron preload script

## Usage

The app uses a local JSON database stored in the Electron user data directory. All data is stored locally on the user's machine.

## Development

Built with:
- React
- Electron
- Vite
- Chart.js
- TailwindCSS
- lowdb (local JSON database)
