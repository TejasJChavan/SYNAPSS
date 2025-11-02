const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// Create the main application window and initialize the local DB
async function createWindow() {
    // Initialize database (require dynamically so file can be ESM or CJS)
    try {
        const db = require("./src/services/db");
        // If CLEAR_DB=true env var is set, wipe DB first. Prefer force-delete if available.
        if (process.env.CLEAR_DB === "true") {
            if (typeof db.resetDatabaseForce === "function") {
                console.log(
                    "CLEAR_DB=true: force-resetting local database (deleting file)..."
                );
                await db.resetDatabaseForce();
            } else if (typeof db.resetDatabase === "function") {
                console.log("CLEAR_DB=true: resetting local database...");
                await db.resetDatabase();
            }
            console.log("CLEAR_DB complete — exiting.");
            // exit early so no window opens
            app.exit(0);
            return;
        }
        if (db && typeof db.initDatabase === "function") {
            await db.initDatabase();
            console.log("Database initialized successfully");
        }
    } catch (err) {
        console.error("Database initialization error:", err);
    }

    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;
    if (isDev) {
        win.loadURL("http://localhost:5173");
        // only open DevTools when explicitly requested by env var OPEN_DEVTOOLS=true
        if (process.env.OPEN_DEVTOOLS === "true") {
            win.webContents.openDevTools();
        }
    } else {
        win.loadFile(path.join(__dirname, "dist", "index.html"));
    }
}

// App lifecycle
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// IPC handlers — each uses dynamic require so `src/services/db` can export in either style
ipcMain.handle("save-assessment", async (_, { patientId, scores }) => {
    try {
        const { addAssessment } = require("./src/services/db");
        const result = await addAssessment({ patientId, scores });
        return { success: true, assessment: result };
    } catch (err) {
        console.error(err);
        return { success: false, error: err.message };
    }
});

ipcMain.handle("get-assessments", async (_, patientId) => {
    try {
        const { getAssessments } = require("./src/services/db");
        return await getAssessments(patientId);
    } catch (err) {
        console.error(err);
        return [];
    }
});

ipcMain.handle("get-patient", async (_, patientId) => {
    try {
        const { getPatient } = require("./src/services/db");
        return await getPatient(patientId);
    } catch (err) {
        console.error("Error fetching patient:", err);
        return null;
    }
});

ipcMain.handle("save-patient", async (_, patientData) => {
    try {
        const { addPatient } = require("./src/services/db");
        const result = await addPatient(patientData);
        return { success: true, patient: result };
    } catch (err) {
        console.error("Error saving patient:", err);
        return { success: false, error: err.message };
    }
});

ipcMain.handle("search-patients", async (_, searchTerm) => {
    try {
        const { searchPatients } = require("./src/services/db");
        return await searchPatients(searchTerm);
    } catch (err) {
        console.error("Error searching patients:", err);
        return [];
    }
});

ipcMain.handle("reset-database", async () => {
    try {
        const { resetDatabase } = require("./src/services/db");
        await resetDatabase();
        return { success: true };
    } catch (err) {
        console.error("Error resetting database:", err);
        return { success: false, error: err.message };
    }
});

ipcMain.handle("force-reset-database", async () => {
    try {
        const { resetDatabaseForce } = require("./src/services/db");
        if (typeof resetDatabaseForce === "function") {
            await resetDatabaseForce();
            return { success: true };
        }
        return { success: false, error: "force not available" };
    } catch (err) {
        console.error("Error force-resetting database:", err);
        return { success: false, error: err.message };
    }
});

ipcMain.handle("delete-assessment", async (_, id) => {
    try {
        const { deleteAssessment } = require("./src/services/db");
        return await deleteAssessment(id);
    } catch (err) {
        console.error("Error deleting assessment:", err);
        return { deleted: 0, error: err.message };
    }
});

ipcMain.handle("get-latest-assessments", async (_, limit = 5) => {
    try {
        const { getLatestAssessments } = require("./src/services/db");
        return await getLatestAssessments(limit);
    } catch (err) {
        console.error("Error getting latest assessments:", err);
        return [];
    }
});
