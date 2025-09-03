# Assignment: BCP Interactive Wizard – Interview Task

## Objective:
Design and structure a simple, interactive wizard for capturing Business Continuity Planning (BCP) details. The flow must be user-friendly, with clear questions, optional/mandatory indicators, and the ability to save or skip certain steps where relevant.

---

## Step 1 – Service & Process Capture
- BCP Details
  - Name of BCP (Mandatory) – Input box
  - Business Unit, Sub-Business Unit (Optional – not mandatory in DB) – Input box
- Service
  - What’s the name of the service you want to protect? (Mandatory) – Input box
  - Description (Optional) – Text area  
  - Note: One service per BCP
- Process – “What are the main processes this service depends on?” (+ Add Process dynamic input box)
- Sites – Multi-select dropdown from system locations OR add new site. Multiple sites can be linked per process
- Process Owner – Input field from BRT roster (Name + Email), capture Primary and Backup owners

---

## Step 2 – Business Impact Analysis (BIA)
- Criticality (MTD) – “When does this process need to be restored if disrupted?” Options: Hours/Days + Input field
- Headcount Requirement – “How many people are required at a minimum if the site is disrupted?” Input field (site + process pair → headcount mapping)
- Dependencies – “Are there any key systems, vendors, or other processes this depends on?” Dropdown: Upstream, IT, Equipment, External + Input box. Allow adding new processes
- Provide Skip Step option

---

## Step 3 – Communication
- Disruption Notifications – “Who should be notified if this service is disrupted?” Input fields for Name + Email. Allow adding individuals, groups, or distribution lists

---

## Step 4 – Risk (Optional)
- Any major risks to note? (e.g., power outage, cyber incident, supply issue) – Text area
- Option to Skip Step

---

## Notes for Candidate
- Clearly mark mandatory vs. optional fields
- Use dynamic input options where users can add multiple values
- Provide Skip Step functionality where required
- Ensure DB integration points are identified (BCP name, service, roster owners, system sites, dependencies)
- Final submission can be in the form of wireframes (Figma/Sketch/Hand-drawn) OR prototype (React/Angular/Tailwind)