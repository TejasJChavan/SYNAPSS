const { app } = require("electron");
const path = require("path");

// default data structure
const defaultData = { patients: [], assessments: [] };

let Low, JSONFile, adapter, db;
let dbPathVar = null;

async function ensureDb() {
    if (db) return;
    // lowdb v7 is ESM; import dynamically from CommonJS
    const lowdb = await import("lowdb");
    const node = await import("lowdb/node");
    Low = lowdb.Low;
    JSONFile = node.JSONFile;

    const dbPath = path.join(app.getPath("userData"), "database.json");
    dbPathVar = dbPath;
    console.log("Local DB path:", dbPath);
    adapter = new JSONFile(dbPathVar);
    // provide defaultData to Low constructor to satisfy lowdb v7 requirement
    db = new Low(adapter, defaultData);
    await db.read();
    if (!db.data) {
        db.data = defaultData;
        await db.write();
    }
}

module.exports.initDatabase = async () => {
    await ensureDb();
};

module.exports.getPatients = async () => {
    await ensureDb();
    return db.data.patients || [];
};

module.exports.addPatient = async (patient) => {
    await ensureDb();
    // accept either patient.patient_id, patient.patientId, or patient.id (legacy)
    const patientId = String(
        patient.patient_id ?? patient.patientId ?? patient.id ?? Date.now()
    );

    // remove any legacy id fields from saved record
    const sanitized = { ...patient };
    delete sanitized.id;
    delete sanitized.patientId;
    delete sanitized.patient_id;

    // check for existing patient with same patient_id
    const existingIndex = (db.data.patients || []).findIndex(
        (p) => p.patient_id === patientId
    );
    if (existingIndex !== -1) {
        // update existing (preserve created_at)
        const existing = db.data.patients[existingIndex];
        const updated = {
            ...existing,
            ...sanitized,
            patient_id: patientId,
            // keep existing.created_at
            updated_at: new Date().toISOString(),
        };
        db.data.patients[existingIndex] = updated;
        await db.write();
        return updated;
    }

    const newPatient = {
        patient_id: patientId,
        created_at: new Date().toISOString(),
        ...sanitized,
    };
    db.data.patients.push(newPatient);
    await db.write();
    return newPatient;
};

module.exports.getAssessments = async (patientId) => {
    await ensureDb();
    const list = (db.data.assessments || []).filter((a) => {
        // support either patientId (camelCase) or patient_id (snake_case)
        return (
            (a.patientId && a.patientId === patientId) ||
            (a.patient_id && a.patient_id === patientId)
        );
    });
    // sort by date descending (newest first)
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
};

module.exports.addAssessment = async (assessment) => {
    await ensureDb();
    // normalize patient id inside assessment
    const patientId = assessment.patientId ?? assessment.patient_id ?? null;
    const sanitized = { ...assessment };
    if (patientId) {
        sanitized.patientId = patientId;
        sanitized.patient_id = patientId;
    }
    const newAssessment = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        ...sanitized,
    };
    db.data.assessments.push(newAssessment);
    await db.write();
    return newAssessment;
};

module.exports.getAssessmentById = async (id) => {
    await ensureDb();
    return db.data.assessments.find((a) => a.id === id);
};

module.exports.deleteAssessment = async (id) => {
    await ensureDb();
    const before = db.data.assessments.length;
    db.data.assessments = (db.data.assessments || []).filter(
        (a) => a.id !== id
    );
    const after = db.data.assessments.length;
    if (after !== before) await db.write();
    return { deleted: before - after };
};

module.exports.searchPatients = async (query) => {
    await ensureDb();
    const lowercaseQuery = (query || "").toLowerCase();
    return (db.data.patients || []).filter((patient) => {
        const name = (patient.name || "").toLowerCase();
        const id = (patient.patient_id || "").toString();
        return name.includes(lowercaseQuery) || id.includes(lowercaseQuery);
    });
};

module.exports.getPatient = async (patientId) => {
    await ensureDb();
    return (
        (db.data.patients || []).find((p) => p.patient_id === patientId) || null
    );
};

module.exports.resetDatabase = async () => {
    await ensureDb();
    db.data = { patients: [], assessments: [] };
    await db.write();
};

module.exports.resetDatabaseForce = async () => {
    try {
        await ensureDb();
        // ✅ Just clear all data instead of deleting the file
        // Create a new object to avoid reference issues
        db.data.patients = [];
        db.data.assessments = [];
        
        // Ensure write completes without blocking
        await db.write();

        console.log("Database truncated successfully (no file deletion).");
        return { success: true };
    } catch (err) {
        console.error("Error truncating database:", err);
        return { success: false, error: err.message };
    }
};


module.exports.getLatestAssessments = async (limit = 5) => {
    await ensureDb();
    const list = (db.data.assessments || [])
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    const latest = list.slice(0, limit);
    // attach patient name if available
    return latest.map((assessment) => {
        const pid = assessment.patientId ?? assessment.patient_id ?? null;
        const patient =
            (db.data.patients || []).find((p) => p.patient_id === pid) || null;
        return {
            ...assessment,
            patientName: patient ? patient.name : null,
            patient_id: pid,
        };
    });
};
