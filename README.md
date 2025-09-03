# BCP Interactive Wizard – Application Flow

## Overview
This prototype guides users through creating a Business Continuity Plan (BCP) across four steps: Service & Processes, Business Impact (BIA), Communication, and Risk. A right-side summary panel shows "Your Plan So Far" and updates live as users enter data. On Submit, a modal displays the collected data with options to copy or download as JSON.

## Step-by-step Flow

### Step 1 – Service & Process Capture
- BCP Details
  - Name of BCP (mandatory)
  - Business Unit (optional)
  - Sub-Business Unit (optional)
- Service
  - Service Name (mandatory)
  - Description (optional)
- Processes
  - Add Process dynamically
  - Select Sites (multi-select from system locations; can add a new site)
  - Owners (Primary and Backup, Name + Email)
- Validation
  - Cannot proceed to next step unless BCP Name and Service Name are provided

### Step 2 – Business Impact Analysis (BIA)
- Criticality (MTD)
  - Time unit: Hours/Days
  - Value: numeric input
- Headcount Requirement
  - For each process-site pair, specify minimum staff required
- Dependencies
  - Add multiple dependencies with Type (Upstream, IT, Equipment, External) + Description
- Skip
  - User can choose to skip this step and return later

### Step 3 – Communication
- Disruption Notifications
  - Add multiple entries (Type: individual/group/distribution)
  - Name and Email fields per entry
  - Edit and remove entries supported

### Step 4 – Risk (Optional)
- Risk Assessment
  - Free-text area for major risks
- Skip
  - User can skip this step and return later

## Right Panel – Your Plan So Far
- Live summary of entered data across all steps
- Service, processes with sites and owners, criticality, dependencies, risks, and notifications
- Sites are displayed as human-readable names (not IDs)

## Submission
- Submit button (visible on Step 4) validates mandatory fields from Step 1
- On successful submit, a modal opens with a JSON summary of all data
  - Copy JSON to clipboard
  - Download JSON as a file named after the BCP

## Data Model (high-level)
- bcpDetails: { name, businessUnit, subBusinessUnit }
- service: { name, description }
- processes: [
  { name, sites: [siteId], owner: { primary: { name, email }, backup: { name, email } } }
]
- biaDetails: {
  criticality: { timeUnit, value },
  headcount: { [processIndex]: { [siteId]: number } },
  dependencies: [ { type, description } ]
}
- notifications: [ { type, name, email } ]
- risks: string

## Notes
- Mandatory fields are marked with an asterisk (*) where applicable
- Skipping is supported in BIA and Risk steps
- No backend integration is included (prototype). Data is shown in the submit modal and can be exported as JSON
