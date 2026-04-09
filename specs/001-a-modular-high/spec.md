# Feature Specification: Modular ERP/Accounting Platform with 1C-Inspired Architecture

**Feature Branch**: `001-a-modular-high`  
**Created**: 2025-01-26  
**Status**: Draft  
**Input**: User description: "a modular, high-performance ERP/Accounting platform inspired by 1C architecture, built in NestJS + PostgreSQL, where all business operations are document-driven and recorded in registers and accounting entries"

## Clarifications

### Session 2025-01-26

- Q: Should the system's default behavior strictly prevent negative inventory balances, or allow them with warnings? → A: Strictly prevent - Block posting with error when balance would go negative (strict inventory control)
- Q: When a backdated document is posted, should the system recalculate all dependent future balances immediately or use eventual consistency? → A: Immediate recalculation - All future balance queries automatically reflect the backdated change in real-time


## User Scenarios & Testing *(mandatory)*

### User Story 1 - Record and Post Business Transactions (Priority: P1)

An accountant needs to record a sales transaction where goods are sold to a customer. They create a sales document, enter line items with quantities and prices, and then post the document. When posted, the system automatically updates inventory balances (reducing stock), increases customer accounts receivable, records revenue, and generates the corresponding accounting entries (debit/credit) according to the chart of accounts.

**Why this priority**: This represents the core value proposition of the platform - capturing business events as documents and automatically maintaining accurate financial and operational records. Without this capability, the system cannot fulfill its primary purpose as an ERP/accounting platform.

**Independent Test**: Can be fully tested by creating a sales document with multiple line items, posting it, and verifying that inventory registers show reduced quantities, financial registers show increased receivables, and accounting entries show proper debit/credit entries. Delivers immediate value by automating the connection between operational and financial data.

**Acceptance Scenarios**:

1. **Given** an accountant has inventory items and customer data in the system, **When** they create a sales document with line items and click "Post", **Then** the document is marked as posted, inventory quantities decrease by the sold amounts, customer balance increases, and double-entry accounting records are generated automatically
2. **Given** a posted sales document exists, **When** the accountant clicks "Unpost", **Then** all register entries and accounting entries created by that document are reversed, restoring inventory quantities and customer balances to their previous state
3. **Given** an accountant attempts to post a sales document, **When** the document has invalid data (e.g., negative quantities, missing customer), **Then** the system prevents posting and displays clear validation errors
4. **Given** multiple users are working concurrently, **When** two users attempt to post documents affecting the same inventory item simultaneously, **Then** the system maintains data consistency and accurate balances without conflicts

---

### User Story 2 - View Real-Time Balances and Analyze Movements (Priority: P2)

A warehouse manager needs to check current inventory levels for specific items across warehouses. They open an inventory balance report, apply filters (date range, warehouse, item category), and view current stock quantities with drill-down capability to see all documents that affected each balance (receipts, sales, transfers). They can export the report to Excel for further analysis or sharing with management.

**Why this priority**: Real-time visibility into operational and financial data is essential for decision-making. This builds on P1 by providing the reporting layer that makes the captured data actionable. Without this, users would have accurate data but no way to access insights.

**Independent Test**: Can be fully tested by posting several inventory-affecting documents (receipts, sales, transfers), then generating an inventory balance report filtered by warehouse and date range. Verify that balances match the sum of all movements, and that drill-down shows source documents. Delivers value by enabling operational visibility and decision support.

**Acceptance Scenarios**:

1. **Given** multiple inventory documents have been posted over time, **When** a manager generates an inventory balance report as of a specific date, **Then** the report shows accurate quantities and values for each item-warehouse combination, calculated from all movements up to that date
2. **Given** a balance report is displayed, **When** the manager clicks on a specific item's balance, **Then** the system displays a detailed list of all documents (receipts, sales, transfers) that contributed to that balance with dates, quantities, and document numbers
3. **Given** a manager needs to analyze data offline, **When** they click "Export to Excel", **Then** the system generates a formatted Excel file with the report data, preserving structure and formatting
4. **Given** a manager is viewing a balance report, **When** they apply filters (date range, warehouse, item category, minimum quantity threshold), **Then** the report updates to show only matching records

---

### User Story 3 - Manage Reference Data with Hierarchies (Priority: P3)

An administrator sets up the system by creating and organizing reference data (catalogs). They create a hierarchical structure of item categories (e.g., "Electronics > Computers > Laptops"), define counterparties (customers and suppliers) with contact details and tax information, set up warehouses and departments. They can organize data into folders, search and filter entries, and establish relationships between entities that will be used when creating documents.

**Why this priority**: Master data management is essential for a functional ERP system, but it's prioritized after transaction recording and reporting because reference data can be set up incrementally. Initial testing can use a minimal set of catalogs. This provides the foundation for organized, scalable data management.

**Independent Test**: Can be fully tested by creating a hierarchical catalog (e.g., items with categories and subcategories), adding entries at different levels, applying filters and search, and then verifying that these entries can be referenced when creating documents. Delivers value by enabling organized master data that improves data quality and user productivity.

**Acceptance Scenarios**:

1. **Given** an administrator is setting up the system, **When** they create a new catalog entry (e.g., a customer) with required fields (code, name) and optional fields (tax number, address, contact), **Then** the entry is saved with a unique code and is immediately available for selection in documents
2. **Given** a catalog supports hierarchical organization (e.g., item categories), **When** the administrator creates parent and child entries, **Then** the system displays a tree structure and supports operations like moving entries, collapsing/expanding levels, and filtering by branch
3. **Given** many catalog entries exist, **When** a user searches by code, name, or other attributes, **Then** the system returns matching results instantly (under 1 second for catalogs with up to 100,000 entries)
4. **Given** a catalog entry is referenced in posted documents, **When** an administrator attempts to delete it, **Then** the system prevents deletion and displays which documents reference this entry

---

### User Story 4 - Track Periodic Data with Information Registers (Priority: P3)

A pricing manager maintains product prices that change over time. They record price updates in an information register, specifying the effective date, item, price type (retail/wholesale), and new price. The system maintains a complete price history, allowing users to query "what was the price of item X on date Y?" When creating sales documents, the system automatically suggests the current price for each item based on the document date and price type.

**Why this priority**: Information registers provide time-based data management for non-transactional information like prices, exchange rates, and settings. While important for real-world operations, basic document posting can function with fixed prices initially, making this lower priority than core transactional features.

**Independent Test**: Can be fully tested by recording multiple price changes for an item over time, then creating sales documents on different dates and verifying that the system suggests the correct historical price based on the document date. Delivers value by automating price lookups and maintaining pricing history for audit and analysis.

**Acceptance Scenarios**:

1. **Given** a pricing manager wants to update prices, **When** they create a new record in the price information register with item, price type, effective date, and new price, **Then** the system stores the record and it becomes the active price from that date forward
2. **Given** multiple price records exist for an item over time, **When** a user creates a sales document dated between two price changes, **Then** the system automatically suggests the price that was effective on the document's date
3. **Given** a manager needs to review pricing history, **When** they query the price register filtered by item and date range, **Then** the system displays all price changes in chronological order showing when each price was effective
4. **Given** an exchange rate information register exists, **When** a document is posted in foreign currency, **Then** the system applies the exchange rate effective on the document's date to calculate base currency amounts

---

### User Story 5 - Execute Universal Business Procedures (Priority: P2)

A developer implements a new document type (e.g., purchase returns). Instead of writing custom posting logic from scratch, they use universal procedures: `getInventoryBalance(item, warehouse, date)` to check available quantities, `postToInventoryRegister(document, movements)` to record inventory changes, and `generateAccountingEntries(document, registerMovements)` to create accounting entries. These reusable procedures work consistently across all document types, reducing development time and ensuring uniform behavior.

**Why this priority**: Universal procedures are a key architectural principle that enables maintainability, consistency, and developer productivity. While developers need this during implementation of new features, initial core features can be built first to validate the architecture, then refactored to use universal procedures.

**Independent Test**: Can be fully tested by implementing two different document types (e.g., sales and purchase returns) that both use the same universal procedures for inventory posting. Verify that both document types produce correct register entries and that changes to the universal procedure affect both document types uniformly. Delivers value by reducing code duplication and standardizing business logic.

**Acceptance Scenarios**:

1. **Given** a developer needs to implement posting logic for a new document type, **When** they call `postToInventoryRegister()` with document details and movement specifications, **Then** the procedure creates appropriate register entries with correct dates, dimensions, and sign (receipt/expense) without requiring document-specific code
2. **Given** multiple document types use the same universal procedure, **When** a business rule change requires modifying how accounting entries are generated, **Then** updating the single universal procedure automatically affects all document types consistently
3. **Given** a user posts a document, **When** the universal procedure `generateAccountingEntries()` executes, **Then** it applies business rules from the chart of accounts configuration to automatically determine debit and credit accounts based on register movements
4. **Given** a developer queries balances, **When** they call `getInventoryBalance(item, warehouse, date)`, **Then** the procedure returns the calculated balance as of that date by aggregating all register movements, working consistently regardless of which document types created those movements

---

### Edge Cases

- What happens when a user attempts to post a document that would create negative inventory balances (overselling)? System MUST prevent posting with a clear error message indicating which items and warehouses would have insufficient stock, showing current balance and required quantity
- How does the system handle posting a document dated in the past when subsequent documents have already been posted for the same items? System MUST maintain date-ordered integrity of register entries and all balance queries MUST automatically reflect the backdated change in real-time by recalculating from all register movements regardless of posting order
- What happens when a user attempts to unpost a document that was the basis for other documents (document chains, e.g., shipment based on sales order)? System should prevent unposting until dependent documents are unposted first, or provide cascade unposting option with confirmation
- How does the system maintain referential integrity when a catalog entry (e.g., item) is referenced in unposted documents versus posted documents? Unposted documents can be modified to remove the reference; posted documents block deletion entirely
- What happens during concurrent posting of multiple documents affecting the same register dimensions (e.g., same item-warehouse combination)? System must use database transactions with appropriate isolation levels to prevent race conditions and ensure accurate balances
- How does the system handle document numbering when multiple users create documents simultaneously? System should use atomic sequences or database-generated numbers to ensure uniqueness without gaps or duplicates
- What happens when a user changes the date of an unposted document to a date where different prices, exchange rates, or other date-dependent values are effective? System should recalculate document amounts based on the new date's effective values
- How are register entries affected when a posted document is modified (if allowed by business rules)? System should either prevent modification of posted documents or require unpost, modify, then re-post workflow
- What happens when system configuration (chart of accounts, posting rules) changes and old documents need to be reviewed or reposted? System should maintain audit trail of configuration changes and allow selective reposting with new rules
- How does the system handle very large documents (e.g., 10,000 line items) in terms of posting performance and transaction management? System should process in batches if needed while maintaining transaction atomicity


## Requirements *(mandatory)*

### Functional Requirements

**Core Document Management**

- **FR-001**: System MUST allow users to create business transaction documents (sales, purchases, receipts, shipments, payments, payroll, etc.) with header information (number, date, counterparty) and line items (tabular sections)
- **FR-002**: System MUST assign unique sequential document numbers automatically when documents are created, ensuring no duplicates or gaps in normal operation
- **FR-003**: System MUST maintain document state as either "Saved" (draft/unposted) or "Posted" (finalized), with clear visual indication of the current state
- **FR-004**: System MUST allow users to post documents, which triggers automatic creation of register entries and accounting entries based on document contents
- **FR-005**: System MUST allow users to unpost previously posted documents, which reverses all register and accounting entries created by that document
- **FR-006**: System MUST prevent modification or deletion of posted documents without first unposting them
- **FR-007**: System MUST validate document data before posting (e.g., all required fields completed, quantities are positive, referenced catalog entries exist)
- **FR-008**: System MUST maintain complete audit trail showing when documents were created, modified, posted, and unposted, including user identification and timestamps

**Register and Accumulation System**

- **FR-009**: System MUST maintain accumulation registers that track resource movements (inventory quantities, cash flows, employee time, etc.) with dimensions (what is being tracked), resources (measured values), and movement type (receipt or expense)
- **FR-010**: System MUST maintain information registers that store time-based reference data (prices, exchange rates, settings) with effective dates and support querying values as of any historical date
- **FR-011**: System MUST create register entries automatically when documents are posted, based on document type-specific posting rules
- **FR-012**: System MUST calculate real-time balances from accumulation registers by summing receipts and subtracting expenses up to any specified date, with immediate consistency ensuring backdated documents are reflected instantly in all balance queries
- **FR-013**: System MUST support querying register data with multiple filter dimensions (item, warehouse, counterparty, period, etc.) and aggregate calculations (sum, count, average)
- **FR-014**: System MUST maintain referential integrity between documents and register entries, ensuring register entries reference the source document that created them
- **FR-015**: System MUST delete or reverse register entries automatically when the source document is deleted or unposted

**Accounting and Financial Reporting**

- **FR-016**: System MUST generate double-entry accounting entries (journal entries with debits and credits) automatically when documents are posted to registers
- **FR-017**: System MUST apply chart of accounts rules to determine which accounts to debit and credit based on document type, register movements, and configured business rules
- **FR-018**: System MUST ensure accounting entries always balance (total debits equal total credits) within each document's posting
- **FR-019**: System MUST support multi-currency accounting with base currency and foreign currency tracking, applying exchange rates from information registers
- **FR-020**: System MUST maintain complete general ledger with all accounting entries organized by date, account, and source document
- **FR-021**: System MUST support analytical dimensions on accounting entries (cost centers, projects, departments) for detailed financial analysis

**Catalog (Master Data) Management**

- **FR-022**: System MUST provide catalogs for reference data including counterparties (customers/suppliers), items (products/services), employees, warehouses, departments, currencies, and accounts
- **FR-023**: System MUST enforce unique codes within each catalog type and validate code format according to configurable rules
- **FR-024**: System MUST support hierarchical organization of catalog entries (folders, categories, groups) with parent-child relationships and tree navigation
- **FR-025**: System MUST allow filtering, sorting, and searching catalog entries by code, description, and custom attributes
- **FR-026**: System MUST prevent deletion of catalog entries that are referenced in posted documents, showing which documents reference the entry
- **FR-027**: System MUST support soft deletion (marking as inactive) for catalog entries that are no longer used but must be retained for historical accuracy
- **FR-028**: System MUST allow attaching additional attributes to catalog entries based on catalog type (e.g., tax numbers for counterparties, dimensions for items)

**Reporting and Analytics**

- **FR-029**: System MUST generate management reports from register data including inventory balances, turnover reports, aging analysis, and cash flow statements
- **FR-030**: System MUST generate financial accounting reports from accounting entries including trial balance, income statement, balance sheet, and general ledger
- **FR-031**: System MUST support drill-down from report aggregates to detailed register entries and source documents
- **FR-032**: System MUST allow users to specify report parameters (date ranges, organizational units, accounts, items) and save frequently-used report configurations
- **FR-033**: System MUST export reports to common formats (Excel, PDF, CSV) preserving structure, formatting, and calculations
- **FR-034**: System MUST calculate report data as of any historical date, not just current date, by filtering register and accounting entries by date
- **FR-035**: System MUST display report results within 5 seconds for standard date ranges (month, quarter, year) with up to 100,000 transactions

**Universal Procedures and Business Logic**

- **FR-036**: System MUST provide reusable procedures for common operations (get balances, post to registers, generate accounting entries) that work uniformly across all document types
- **FR-037**: System MUST allow configuration of posting rules that map document types to register types and accounting accounts without requiring code changes
- **FR-038**: System MUST support document chains where one document can be created based on another (e.g., shipment based on sales order), copying relevant data and maintaining links
- **FR-039**: System MUST validate business rules before posting (e.g., sufficient inventory quantity, credit limit checks) and MUST strictly prevent posting when validation fails, displaying specific error messages with current values and requirements
- **FR-039a**: System MUST check inventory availability before posting documents that reduce stock, preventing negative balances by blocking the transaction and showing which items/warehouses have insufficient quantity

**System Configuration and Setup**

- **FR-040**: System MUST provide constants (system-wide configuration values) organized by business area (inventory management, payroll, accounting) that can be modified through a setup wizard
- **FR-041**: System MUST store constants with effective dates when values change over time (e.g., tax rates, salary scales)
- **FR-042**: System MUST allow administrators to configure chart of accounts structure, including account codes, names, types (asset, liability, equity, revenue, expense), and posting rules
- **FR-043**: System MUST support multiple organizational structures (companies, branches, warehouses) with appropriate data segregation and consolidation capabilities

**Data Integrity and Performance**

- **FR-044**: System MUST use database transactions to ensure atomicity of document posting (all register entries and accounting entries succeed together or all fail together)
- **FR-045**: System MUST handle concurrent operations safely, preventing race conditions when multiple users post documents affecting the same registers simultaneously
- **FR-046**: System MUST maintain data consistency when operations are interrupted (power loss, network failure), ensuring no partial commits
- **FR-047**: System MUST support high transaction volumes (1,000+ documents posted per hour) without degradation in posting or reporting performance
- **FR-048**: System MUST index register data appropriately to support fast balance calculations and report generation even with millions of register entries

**User Interface and Experience**

- **FR-049**: System MUST organize user interface by business areas (purchasing, sales, inventory, payroll, financials, reports) with intuitive navigation
- **FR-050**: System MUST provide unified CRUD (Create, Read, Update, Delete) interfaces for catalogs with consistent layouts and behaviors
- **FR-051**: System MUST provide document entry forms with header section and tabular sections (line items) that support adding, editing, and removing rows
- **FR-052**: System MUST auto-complete or provide selection lists when users enter catalog references (items, counterparties, etc.)
- **FR-053**: System MUST show document posting status clearly and provide actionable feedback when posting fails (specific validation errors, not generic messages)

### Key Entities

**Document** (Base concept for all business transactions)
- Represents a business event (sale, purchase, payment, receipt, etc.)
- Has unique number and date identifying when the event occurred
- Contains header data (references to counterparties, locations, etc.)
- Contains tabular sections (line items) with details of goods, services, or amounts
- Has posting state (saved/unposted or posted)
- When posted, generates movements in registers and accounting entries
- Maintains audit trail of creation, modifications, and posting events
- Can be part of document chains (based on or basis for other documents)

**Catalog Entry** (Master/reference data)
- Represents persistent business entity (item, counterparty, employee, warehouse, account, etc.)
- Has unique code and descriptive name within its catalog type
- May have parent-child relationships forming hierarchies
- Contains type-specific attributes (tax numbers for counterparties, dimensions for items)
- Can be marked as folder/group (container) or individual entry
- Can be marked as inactive but remains in system for historical integrity
- Referenced by documents and cannot be deleted while references exist

**Accumulation Register Entry** (Resource movement)
- Records a change in a quantitative or monetary resource (inventory, cash, employee time)
- Has dimensions identifying what is being tracked (item, warehouse, counterparty, etc.)
- Has resources storing measured values (quantity, amount in base and foreign currency)
- Has movement type indicating direction (receipt increases balance, expense decreases balance)
- Always references the source document that created it
- Has date determining when the movement occurred (usually document date)
- Used to calculate balances by aggregating movements up to a specified date
- Examples: inventory movement (item + warehouse dimensions, quantity + cost resources), cash movement (account + counterparty dimensions, amount resource)

**Information Register Entry** (Time-based reference data)
- Stores data that varies over time (prices, exchange rates, settings)
- Has dimensions identifying what the data applies to (item + price type, currency pair, etc.)
- Has effective date indicating when the data becomes active
- Has resource values storing the actual data (price, rate, setting value)
- Queried to find value effective on a specific date
- Does not aggregate like accumulation registers; queries return the latest record before or on the specified date
- Examples: item prices (item + price type dimensions, price resource), exchange rates (from currency + to currency dimensions, rate resource)

**Accounting Entry** (Double-entry bookkeeping record)
- Represents one side (debit or credit) of a journal entry
- References the account from chart of accounts
- Contains amount in base currency and optionally foreign currency
- Has analytical dimensions for detailed tracking (cost center, project, department)
- Always created in balanced pairs or sets (debits equal credits)
- References the source document and register movements that triggered generation
- Has date (usually document date) determining accounting period
- Used to generate financial statements and general ledger reports

**Chart of Accounts Configuration**
- Defines account structure (code, name, type: asset/liability/equity/revenue/expense)
- Specifies which analytical dimensions are required for each account
- Contains posting rules that map document types and register movements to account pairs (debit account + credit account)
- Configurable by administrators without code changes
- Used by universal procedures to generate accounting entries automatically

**Constant** (System configuration value)
- Stores configuration setting that applies system-wide or to a business area
- Has effective date if value changes over time (e.g., tax rate changes)
- Organized by business area (inventory management, payroll, accounting, etc.)
- Editable through setup wizard interface
- Examples: default VAT rate, inventory valuation method (FIFO/LIFO/Average), fiscal year start date

**Universal Procedure** (Reusable business logic)
- Polymorphic function that works across multiple document types and entity types
- Provides consistent behavior (get balance, post to register, generate accounting entry)
- Accepts generic parameters (entity type, dimensions, date, etc.)
- Applied uniformly to ensure business rule consistency
- Examples: `getBalance(registerType, dimensions, date)`, `postMovements(document, registerType, movements)`, `generateAccountingEntries(document, registerMovements, chartOfAccounts)`

**Report Configuration**
- Defines report parameters (date range, filters, groupings, sorting)
- Can be saved for reuse (monthly inventory report, quarterly financial statements)
- Specifies data source (which registers or accounting entries)
- Defines aggregations and calculations
- Specifies output format (screen, Excel, PDF)
- Supports drill-down navigation to source documents

## Success Criteria *(mandatory)*

### Measurable Outcomes

**Transaction Processing Performance**

- **SC-001**: Users can create and post a document with up to 100 line items in under 10 seconds, maintaining system responsiveness
- **SC-002**: System processes at least 1,000 document postings per hour during peak periods without performance degradation or errors
- **SC-003**: Unposting a document completes in under 5 seconds regardless of how many register entries and accounting entries it created
- **SC-004**: System maintains data consistency with zero data corruption incidents even when 50+ concurrent users are posting documents simultaneously

**Reporting and Query Performance**

- **SC-005**: Inventory balance reports covering up to 10,000 items across 50 warehouses generate in under 10 seconds for monthly periods
- **SC-006**: Financial statements (trial balance, income statement, balance sheet) generate in under 15 seconds for quarterly periods with up to 500,000 accounting entries
- **SC-007**: Drill-down from report aggregate to source document list completes in under 3 seconds
- **SC-008**: Balance queries for any date in history (e.g., "inventory as of 6 months ago") return results in under 5 seconds

**Data Accuracy and Integrity**

- **SC-009**: 100% of posted documents result in balanced accounting entries (debits equal credits) with zero manual correction needed
- **SC-010**: Inventory balances calculated from register entries match physical inventory with 99%+ accuracy (variances only due to actual operational differences, not system errors)
- **SC-011**: System prevents all attempts to create negative balances when configured to enforce balance rules, with zero successful constraint violations
- **SC-012**: Document posting and unposting maintains perfect referential integrity between documents, register entries, and accounting entries (zero orphaned records)

**User Productivity and Efficiency**

- **SC-013**: Accountants reduce time spent on month-end closing by 60% compared to manual bookkeeping, completing close within 2 business days
- **SC-014**: Users complete common tasks (create sales document, post it, view updated balance) 40% faster than in previous systems after 2 weeks of training
- **SC-015**: 90% of document postings succeed on first attempt without validation errors, indicating intuitive data entry and clear validation messages
- **SC-016**: Users successfully locate needed reports and generate them on first attempt 85% of the time, indicating effective organization and navigation

**System Scalability and Capacity**

- **SC-017**: System supports growth to 1 million posted documents and 10 million register entries without requiring architectural changes
- **SC-018**: Adding new document types or register types takes under 2 days of development time (for standard cases), demonstrating effective reuse of universal procedures
- **SC-019**: Database storage grows at predictable rate (under 1GB per 100,000 documents including all register and accounting entries)
- **SC-020**: System supports at least 200 concurrent users performing mixed operations (data entry, posting, reporting) with average response time under 2 seconds

**Operational Reliability**

- **SC-021**: System achieves 99.5% uptime during business hours, with planned maintenance occurring only outside business hours
- **SC-022**: Zero data loss incidents occur even during system failures, power outages, or crashed transactions
- **SC-023**: Complete database backup completes in under 2 hours and restore from backup completes in under 4 hours
- **SC-024**: System recovers automatically from temporary failures (network hiccups, database connection loss) without requiring user intervention or losing user's work

**Audit and Compliance**

- **SC-025**: Complete audit trail exists for 100% of financial transactions, showing who created, modified, posted, or unposted each document with timestamps
- **SC-026**: System produces all regulatory financial reports (trial balance, financial statements) in formats that meet local accounting standards and regulations
- **SC-027**: Historical data reconstruction is possible for any past date - system can reproduce financial statements exactly as they were on any historical date
- **SC-028**: System supports audit inquiries by providing drill-down from any financial report line to source documents in under 30 seconds

**User Adoption and Satisfaction**

- **SC-029**: 80% of users rate the system as "meets expectations" or better after 1 month of production use
- **SC-030**: Support ticket volume for data entry errors decreases by 50% within 3 months, indicating improved data validation and user guidance
- **SC-031**: User error rate (requiring document correction or re-entry) is under 5% of total documents created
- **SC-032**: 90% of new users can complete basic workflows (create catalog entry, create and post document, generate report) independently after 4 hours of training
