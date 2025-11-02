// Options for each domain and subdomain
// Each entry can specify options for the entire domain, or override for specific subdomains

// Helper function to get options for a specific domain and subdomain
export function getOptionsForDomainSubdomain(domain, subdomain) {
    // Check if there's a specific override for this subdomain
    if (DOMAIN_SUBDOMAIN_OPTIONS[domain]?.[subdomain]) {
        return DOMAIN_SUBDOMAIN_OPTIONS[domain][subdomain];
    }
    
    // Check if there are domain-wide options
    if (DOMAIN_SUBDOMAIN_OPTIONS[domain]?.["__default__"]) {
        return DOMAIN_SUBDOMAIN_OPTIONS[domain]["__default__"];
    }
    
    // Fall back to default options if nothing is specified
    return DEFAULT_OPTIONS;
}

// Default options (fallback)
const DEFAULT_OPTIONS = [
    { value: 0, label: "0", description: "" },
    { value: 1, label: "1", description: "" },
    { value: 2, label: "2", description: "" },
    { value: 3, label: "3", description: "" },
    { value: 4, label: "4", description: "" },
];

// Domain and subdomain specific options from SYNAPSS PDF
// EXACT text as provided, no paraphrasing
export const DOMAIN_SUBDOMAIN_OPTIONS = {
    "Positive Symptoms": {
        "Delusions": [
            { value: 0, label: "0", description: "No delusional beliefs." },
            { value: 1, label: "1", description: "Occasional questionable ideas; easily corrected" },
            { value: 2, label: "2", description: "Clear but limited delusional content; mild influence on behavior" },
            { value: 3, label: "3", description: "Prominent, systematized delusions; significant behavioral impact" },
            { value: 4, label: "4", description: "Pervasive, bizarre, or multiple delusional belief systems dominating behavior" },
        ],
        "Hallucinations": [
            { value: 0, label: "0", description: "No reported/ observed hallucinations" },
            { value: 1, label: "1", description: "Vague perceptual distortions or illusions" },
            { value: 2, label: "2", description: "Occasional hallucinations; mild or limited distress" },
            { value: 3, label: "3", description: "Frequent hallucinations; moderate distress" },
            { value: 4, label: "4", description: "Persistent hallucinations influencing behavior" },
        ],
    },
    "Negative Symptoms": {
        "Affective Flattening": [
            { value: 0, label: "0", description: "Normal range of affect" },
            { value: 1, label: "1", description: "Slight reduction in facial / vocal expressiveness" },
            { value: 2, label: "2", description: "Noticeably blunted affect; limited emotional reactivity" },
            { value: 3, label: "3", description: "Marked flatness of affect; minimal facial or voice modulation" },
            { value: 4, label: "4", description: "No visible affective expression" },
        ],
        "Avolition": [
            { value: 0, label: "0", description: "Active, self-motivated" },
            { value: 1, label: "1", description: "Occasionally needs prompting" },
            { value: 2, label: "2", description: "Often lacks initiative; moderate inactivity" },
            { value: 3, label: "3", description: "Rarely initiates activity; spends most time inactive" },
            { value: 4, label: "4", description: "Complete lack of motivation; dependence on others" },
        ],
        "Alogia": [
            { value: 0, label: "0", description: "Normal speech output and content" },
            { value: 1, label: "1", description: "Mild reduction in spontaneity" },
            { value: 2, label: "2", description: "Noticeable poverty of speech or speech content" },
            { value: 3, label: "3", description: "Sparse, brief replies; significant thought blocking" },
            { value: 4, label: "4", description: "Virtually mute or unresponsive" },
        ],
        "Anhedonia": [
            { value: 0, label: "0", description: "Normal enjoyment of activities" },
            { value: 1, label: "1", description: "Slight reduction in experience of pleasure" },
            { value: 2, label: "2", description: "Enjoys fewer activities; moderate loss of interest" },
            { value: 3, label: "3", description: "Rarely experiences pleasure; marked detachment" },
            { value: 4, label: "4", description: "No pleasure in any activity; complete withdrawal" },
        ],
    },
    "Disorganized Symptoms": {
        "Bizarre Behavior": [
            { value: 0, label: "0", description: "Behavior and attire appropriate to context" },
            { value: 1, label: "1", description: "Slightly unusual mannerisms" },
            { value: 2, label: "2", description: "Occasional odd actions or attire" },
            { value: 3, label: "3", description: "Frequently or strikingly socially inappropriate behaviors" },
            { value: 4, label: "4", description: "Constantly bizarre or socially disruptive behaviors" },
        ],
        "Inappropriate Affect": [
            { value: 0, label: "0", description: "Appropriate affect" },
            { value: 1, label: "1", description: "Mildly incongruent affect at times" },
            { value: 2, label: "2", description: "Frequent mismatch between mood and context" },
            { value: 3, label: "3", description: "Regularly inappropriate or incongruent affect" },
            { value: 4, label: "4", description: "Grossly incongruent or bizarre affect" },
        ],
        "Formal Thought Disorder": [
            { value: 0, label: "0", description: "Coherent and goal-directed speech" },
            { value: 1, label: "1", description: "Slightly tangential or circumstantial speech" },
            { value: 2, label: "2", description: "Noticeably disorganized; occasional derailment" },
            { value: 3, label: "3", description: "Frequent incoherence or illogical connections" },
            { value: 4, label: "4", description: "Severely disorganized, incomprehensible, or \"word-salad\" speech" },
        ],
    },
    "Behavioral Dysfunction": {
        "Aggression": [
            { value: 0, label: "0", description: "Calm and non-aggressive" },
            { value: 1, label: "1", description: "Irritable tone; brief argumentativeness" },
            { value: 2, label: "2", description: "Occasional verbal aggression; no physical acts" },
            { value: 3, label: "3", description: "Frequent verbal aggression, threats, or minor physical acts" },
            { value: 4, label: "4", description: "Repeated and/or severe physical aggression" },
        ],
        "Hostility": [
            { value: 0, label: "0", description: "Cooperative and trusting" },
            { value: 1, label: "1", description: "Occasionally defensive" },
            { value: 2, label: "2", description: "Noticeably suspicious or irritable" },
            { value: 3, label: "3", description: "Overt hostility towards examiner/clinician or others" },
            { value: 4, label: "4", description: "Persistent, intense hostility; refuses interaction" },
        ],
        "Impulsivity": [
            { value: 0, label: "0", description: "Thoughtful; self-controlled" },
            { value: 1, label: "1", description: "Occasionally acts hastily" },
            { value: 2, label: "2", description: "Frequent impulsive decisions or comments" },
            { value: 3, label: "3", description: "Regularly engages in risky or inappropriate acts" },
            { value: 4, label: "4", description: "Severe, uncontrolled impulsivity" },
        ],
    },
    "Cognitive Impairment": {
        "Sustained Attention": [
            { value: 0, label: "0", description: "Normal sustained attention" },
            { value: 1, label: "1", description: "Occasional lapses in focus" },
            { value: 2, label: "2", description: "Frequent distractibility; needs redirection" },
            { value: 3, label: "3", description: "Difficulty completing simple tasks without prompts" },
            { value: 4, label: "4", description: "Cannot sustain focus for even brief periods" },
        ],
        "Working Memory": [
            { value: 0, label: "0", description: "No apparent deficits" },
            { value: 1, label: "1", description: "Occasional forgetfulness" },
            { value: 2, label: "2", description: "Needs repetition for multi-step tasks" },
            { value: 3, label: "3", description: "Frequently forgets simple instructions" },
            { value: 4, label: "4", description: "Unable to retain basic information" },
        ],
        "Executive Function": [
            { value: 0, label: "0", description: "Normal planning and reasoning" },
            { value: 1, label: "1", description: "Slight difficulty adapting to change" },
            { value: 2, label: "2", description: "Struggles with problem-solving or set-shifting tasks" },
            { value: 3, label: "3", description: "Poor organization; cannot plan daily activities" },
            { value: 4, label: "4", description: "Completely unable to plan or adapt behavior" },
        ],
        "Processing Speed": [
            { value: 0, label: "0", description: "Normal processing speed" },
            { value: 1, label: "1", description: "Slight slowness in responding" },
            { value: 2, label: "2", description: "Noticeable delay in comprehension or action" },
            { value: 3, label: "3", description: "Markedly slow to respond or process information" },
            { value: 4, label: "4", description: "Extremely slow or unable to process simple input" },
        ],
    },
    "Depression": {
        "Depressed Mood": [
            { value: 0, label: "0", description: "Non-depressed mood" },
            { value: 1, label: "1", description: "Occasional low mood" },
            { value: 2, label: "2", description: "Persistent low mood; mild impact" },
            { value: 3, label: "3", description: "Deep sadness most of the day" },
            { value: 4, label: "4", description: "Pervasive, incapacitating depressed mood" },
        ],
        "Hopelessness": [
            { value: 0, label: "0", description: "Optimistic, future oriented" },
            { value: 1, label: "1", description: "Mild discouragement" },
            { value: 2, label: "2", description: "Frequent hopeless thoughts" },
            { value: 3, label: "3", description: "Feeling of purposelessness in life" },
            { value: 4, label: "4", description: "Persistent hopelessness; no expectation of improvement" },
        ],
        "Guilt": [
            { value: 0, label: "0", description: "Normal self-evaluation of responsibility" },
            { value: 1, label: "1", description: "Mild self-blame" },
            { value: 2, label: "2", description: "Frequent guilt or self-criticism" },
            { value: 3, label: "3", description: "Intense guilt disproportionate to events" },
            { value: 4, label: "4", description: "Persistent delusional guilt" },
        ],
        "Suicidal Ideation": [
            { value: 0, label: "0", description: "None" },
            { value: 1, label: "1", description: "Passive suicidal thoughts" },
            { value: 2, label: "2", description: "Occasional thoughts; no intent" },
            { value: 3, label: "3", description: "Frequent thoughts; some planning to attempt" },
            { value: 4, label: "4", description: "Active intent or recent attempt" },
        ],
    },
    "Anxiety": {
        "Worry": [
            { value: 0, label: "0", description: "Typical, manageable worry" },
            { value: 1, label: "1", description: "Occasional excessive concern" },
            { value: 2, label: "2", description: "Frequent worry interfering with concentration" },
            { value: 3, label: "3", description: "Persistent preoccupation with fear or doubt" },
            { value: 4, label: "4", description: "Pervasive, disabling anxiety" },
        ],
        "Panic": [
            { value: 0, label: "0", description: "None" },
            { value: 1, label: "1", description: "Occasional brief anxiety spikes" },
            { value: 2, label: "2", description: "Infrequent panic attacks; mild distress" },
            { value: 3, label: "3", description: "Recurrent panic attacks causing avoidance/withdrawal" },
            { value: 4, label: "4", description: "Frequent and/or incapacitating panic attacks" },
        ],
        "Social Anxiety": [
            { value: 0, label: "0", description: "Comfortable in social settings" },
            { value: 1, label: "1", description: "Mild nervousness in large groups" },
            { value: 2, label: "2", description: "Noticeable discomfort; avoids some situations" },
            { value: 3, label: "3", description: "Regular avoidance of social interaction" },
            { value: 4, label: "4", description: "Severe avoidance/withdrawal from social interaction" },
        ],
    },
    "Insight": {
        "Awareness of Illness": [
            { value: 0, label: "0", description: "Fully aware and accepts illness" },
            { value: 1, label: "1", description: "Minor minimization of symptoms" },
            { value: 2, label: "2", description: "Partial awareness; uncertain or ambivalent" },
            { value: 3, label: "3", description: "Denies illness despite evidence" },
            { value: 4, label: "4", description: "Completely lacks awareness; rejects all feedback" },
        ],
        "Reality Testing": [
            { value: 0, label: "0", description: "Fully intact" },
            { value: 1, label: "1", description: "Occasionally questions own beliefs/perceptions" },
            { value: 2, label: "2", description: "Sometimes confuses internal beliefs/experiences with reality" },
            { value: 3, label: "3", description: "Frequently convinced by false beliefs/perceptions" },
            { value: 4, label: "4", description: "Completely impaired; no reality discrimination" },
        ],
        "Treatment Adherence": [
            { value: 0, label: "0", description: "Fully compliant; proactive in treatment" },
            { value: 1, label: "1", description: "Occasionally forgets or questions need for treatment" },
            { value: 2, label: "2", description: "Inconsistent adherence to treatment" },
            { value: 3, label: "3", description: "Frequently resists or misses treatment" },
            { value: 4, label: "4", description: "Complete refusal or noncompliance" },
        ],
    },
};
