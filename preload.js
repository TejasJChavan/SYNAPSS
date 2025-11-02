const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    saveAssessment: (data) => ipcRenderer.invoke("save-assessment", data),
    getAssessments: (id) => ipcRenderer.invoke("get-assessments", id),
    getPatient: (id) => ipcRenderer.invoke("get-patient", id),
    savePatient: (data) => ipcRenderer.invoke("save-patient", data),
    searchPatients: (term) => ipcRenderer.invoke("search-patients", term),
    deleteAssessment: (id) => ipcRenderer.invoke("delete-assessment", id),
    getLatestAssessments: (limit) =>
        ipcRenderer.invoke("get-latest-assessments", limit),
    resetDatabase: () => ipcRenderer.invoke("reset-database"),
    forceResetDatabase: () => ipcRenderer.invoke("force-reset-database"),
});
