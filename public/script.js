    // =============================
    // BASIC APP CONFIGURATION
    // =============================
    const STORAGE_KEY = "torquegarage-cloud-state";
    const AUTH_KEY = "torquegarage-cloud-auth";
    const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
    const SESSION_PERSIST_INTERVAL_MS = 60 * 1000;
    const DEFAULT_CUSTOMER_PASSWORD = "customer123";
    const DEFAULT_OPERATOR_PASSWORD = "operator123";
    const MIN_PASSWORD_LENGTH = 6;
    const DEFAULT_CUSTOMER_PASSWORD_HASH = "1ef916ed";
    const DEMO_PASSWORD_HASHES = {
      admin: "185030e4",
      operator: "ef24a767"
    };
    const BAYS = ["Bay 1", "Bay 2", "Bay 3", "Bay 4"];
    const APPOINTMENT_STATUS = {
      PENDING_APPROVAL: "PENDING_APPROVAL",
      REJECTED: "REJECTED",
      ASSIGNED: "ASSIGNED",
      IN_PROGRESS: "IN_PROGRESS",
      WAITING_FOR_PARTS: "WAITING_FOR_PARTS",
      WAITING_FOR_APPROVAL: "WAITING_FOR_APPROVAL",
      ON_HOLD: "ON_HOLD",
      WORK_COMPLETED: "WORK_COMPLETED",
      VERIFIED: "VERIFIED",
      READY_FOR_PICKUP: "READY_FOR_PICKUP",
      COMPLETED: "COMPLETED"
    };
    const WORK_ORDER_STATUS = {
      ASSIGNED: "ASSIGNED",
      IN_PROGRESS: "IN_PROGRESS",
      WAITING_FOR_PARTS: "WAITING_FOR_PARTS",
      WAITING_FOR_APPROVAL: "WAITING_FOR_APPROVAL",
      ON_HOLD: "ON_HOLD",
      WORK_COMPLETED: "WORK_COMPLETED",
      VERIFIED: "VERIFIED",
      READY_FOR_PICKUP: "READY_FOR_PICKUP",
      COMPLETED: "COMPLETED"
    };
    const TECHNICIAN_PROFILES = {
      "Jane Doe": { skills: ["Oil Change", "Tire Rotation", "Brake Inspection", "Coolant Flush"], maxConcurrentJobs: 2 },
      "Alex Rivera": { skills: ["General Repair", "Brake Inspection", "Coolant Flush"], maxConcurrentJobs: 2 },
      "Sam Lee": { skills: ["Oil Change", "Tire Rotation", "Brake Inspection"], maxConcurrentJobs: 3 },
      "Chris Hall": { skills: ["General Repair", "Oil Change", "Coolant Flush"], maxConcurrentJobs: 2 }
    };
    const ACTIVE_APPOINTMENT_STATUSES = [
      APPOINTMENT_STATUS.PENDING_APPROVAL,
      APPOINTMENT_STATUS.ASSIGNED,
      APPOINTMENT_STATUS.IN_PROGRESS,
      APPOINTMENT_STATUS.WAITING_FOR_PARTS,
      APPOINTMENT_STATUS.WAITING_FOR_APPROVAL,
      APPOINTMENT_STATUS.ON_HOLD,
      APPOINTMENT_STATUS.WORK_COMPLETED,
      APPOINTMENT_STATUS.VERIFIED,
      APPOINTMENT_STATUS.READY_FOR_PICKUP
    ];
    const SERVICE_CATALOG = [
      { name: "Oil Change", intervalMiles: 5000, intervalLabel: "Every 5,000 miles" },
      { name: "Tire Rotation", intervalMiles: 7500, intervalLabel: "Every 7,500 miles" },
      { name: "Brake Inspection", intervalMiles: 12000, intervalLabel: "Every 12,000 miles" },
      { name: "Coolant Flush", intervalMiles: 30000, intervalLabel: "Every 30,000 miles" },
      { name: "General Repair", intervalMiles: null, intervalLabel: "As needed" }
    ];

    // =============================
    // DEMO USERS AND SEEDED DATA
    // =============================
    const demoUsers = [
      { id: "admin-user", role: "admin", email: "admin@icloud.com", passwordHash: DEMO_PASSWORD_HASHES.admin, name: "Shop Admin" },
      { id: "operator-jane-doe", role: "operator", email: "operator@icloud.com", passwordHash: DEMO_PASSWORD_HASHES.operator, name: "Jane Doe" },
      { id: "operator-alex-rivera", role: "operator", email: "alex.rivera@icloud.com", passwordHash: DEMO_PASSWORD_HASHES.operator, name: "Alex Rivera" },
      { id: "operator-sam-lee", role: "operator", email: "sam.lee@icloud.com", passwordHash: DEMO_PASSWORD_HASHES.operator, name: "Sam Lee" },
      { id: "operator-chris-hall", role: "operator", email: "chris.hall@icloud.com", passwordHash: DEMO_PASSWORD_HASHES.operator, name: "Chris Hall" }
    ];

    function createDemoState() {
      const customers = [
        { id: crypto.randomUUID(), name: "Elon Musk", address: "1 Rocket Rd, Hawthorne, CA", phone: "111-222-3333", email: "elon.musk@email.com", loyaltyTier: "Fleet" },
        { id: crypto.randomUUID(), name: "Jeff Bezos", address: "2121 7th Ave, Seattle, WA", phone: "222-333-4444", email: "jeff.bezos@email.com", loyaltyTier: "Gold" },
        { id: crypto.randomUUID(), name: "Bernard Arnault", address: "22 Avenue Montaigne, Paris, FR", phone: "333-444-5555", email: "bernard.arnault@email.com", loyaltyTier: "None" }
      ];

      const vehicles = [
        { id: crypto.randomUUID(), customerId: customers[0].id, vin: "TESLA123456789012", year: "", make: "Tesla", model: "Model S", mileage: 12000, warranty: "Factory coverage active", codes: "" },
        { id: crypto.randomUUID(), customerId: customers[1].id, vin: "AMZN9876543210001", year: "", make: "Rivian", model: "R1T", mileage: 8000, warranty: "Factory coverage active", codes: "" },
        { id: crypto.randomUUID(), customerId: customers[2].id, vin: "LVMH5555555555555", year: "", make: "Mercedes-Benz", model: "S-Class", mileage: 15000, warranty: "Factory coverage active", codes: "" }
      ];

      const demoStartTime = new Date(Date.now() - (24 * 60 * 60 * 1000));
      const demoReadyTime = new Date(Date.now() - (2 * 60 * 60 * 1000));
      const demoPendingTime = new Date(Date.now() + (24 * 60 * 60 * 1000));

      const demoAppointment = {
        id: crypto.randomUUID(),
        customerId: customers[0].id,
        vehicleId: vehicles[0].id,
        appointmentAt: demoStartTime.toISOString(),
        serviceType: "Oil Change",
        bookingNote: "Please seat at the waiting room.",
        approved: true,
        approvedByAdmin: "Shop Admin",
        assignedOperator: "Jane Doe",
        bay: "Bay 1",
        estimatedDurationHours: 2,
        status: APPOINTMENT_STATUS.READY_FOR_PICKUP,
        faults: "Routine maintenance",
        inventoryUsed: "FRAM Extra Guard PH3614 x1, Mobil 1 Extended Performance 5W-30 Full Synthetic Motor Oil x1",
        laborStartedAt: demoStartTime.toISOString(),
        notificationSentAt: demoReadyTime.toISOString()
      };

      const pendingAppointment = {
        id: crypto.randomUUID(),
        customerId: customers[1].id,
        vehicleId: vehicles[1].id,
        appointmentAt: demoPendingTime.toISOString(),
        serviceType: "Brake Inspection",
        bookingNote: "Customer requested first available review.",
        approved: false,
        approvedByAdmin: "",
        assignedOperator: "",
        bay: "",
        estimatedDurationHours: 1,
        status: APPOINTMENT_STATUS.PENDING_APPROVAL,
        faults: "",
        inventoryUsed: "",
        laborStartedAt: "",
        notificationSentAt: ""
      };

      return {
        users: [
          ...demoUsers,
          ...customers.map((customer) => ({
            id: `customer-${customer.id}`,
            role: "customer",
            email: customer.email.toLowerCase(),
            passwordHash: DEFAULT_CUSTOMER_PASSWORD_HASH,
            name: customer.name,
            customerId: customer.id
          }))
        ],
        customers,
        vehicles,
        loyalty: customers.map((customer) => ({
          id: crypto.randomUUID(),
          customerId: customer.id,
          points: customer.loyaltyTier === "Fleet" ? 250 : customer.loyaltyTier === "Gold" ? 150 : 0,
          tier: customer.loyaltyTier
        })),
        workOrders: [
          {
            id: crypto.randomUUID(),
            customerId: customers[0].id,
            vehicleId: vehicles[0].id,
            appointmentId: demoAppointment.id,
            assignedTechnician: "Jane Doe",
            servicesPerformed: "Oil Change",
            status: WORK_ORDER_STATUS.READY_FOR_PICKUP,
            faults: "Routine maintenance",
            createdAt: demoStartTime.toISOString(),
            startedAt: demoStartTime.toISOString(),
            readyForPickupAt: demoReadyTime.toISOString(),
            completedAt: "",
            verifiedAt: demoReadyTime.toISOString(),
            reviewRequestedAt: demoReadyTime.toISOString()
          }
        ],
        workOrderParts: [],
        appointments: [demoAppointment, pendingAppointment],
        inventory: [
          { id: crypto.randomUUID(), name: "NGK Laser Iridium Spark Plug 92145", sku: "797681", quantity: 32, reorderPoint: 12, price: 14.99 },
          { id: crypto.randomUUID(), name: "Mobil 1 Extended Performance 5W-30 Full Synthetic Motor Oil", sku: "M1-5W30-5QT", quantity: 18, reorderPoint: 6, price: 41.99 },
          { id: crypto.randomUUID(), name: "Prestone DEX-COOL 50/50 Antifreeze Coolant 1 Gallon", sku: "DEX-COOL-1GAL", quantity: 14, reorderPoint: 4, price: 17.99 },
          { id: crypto.randomUUID(), name: "FRAM Extra Guard PH3614", sku: "352777", quantity: 26, reorderPoint: 10, price: 8.99 },
          { id: crypto.randomUUID(), name: "FRAM CA10755 Air Filter", sku: "536014", quantity: 16, reorderPoint: 6, price: 19.99 },
          { id: crypto.randomUUID(), name: "FRAM CF10134 Cabin Filter", sku: "386009", quantity: 12, reorderPoint: 5, price: 24.99 },
          { id: crypto.randomUUID(), name: "Duralast Ceramic Brake Pads MKD905", sku: "814243", quantity: 8, reorderPoint: 4, price: 69.99 },
          { id: crypto.randomUUID(), name: "Rain-X Latitude 22 in Wiper Blade", sku: "507928", quantity: 20, reorderPoint: 8, price: 21.99 },
          { id: crypto.randomUUID(), name: "Duralast Gold Battery H6-DLG", sku: "832330", quantity: 5, reorderPoint: 2, price: 199.99 },
          { id: crypto.randomUUID(), name: "Duralast Belt 6PK2230", sku: "932329", quantity: 9, reorderPoint: 3, price: 37.99 }
        ]
      };
    }

    // =============================
    // LOAD / SAVE STATE
    // =============================
    function normalizeState(rawState) {
      return {
        users: rawState.users || [
          ...demoUsers,
          ...((rawState.customers || []).map((customer) => ({
            id: `customer-${customer.id}`,
            role: "customer",
            email: customer.email.toLowerCase(),
            passwordHash: DEFAULT_CUSTOMER_PASSWORD_HASH,
            name: customer.name,
            customerId: customer.id
          })))
        ],
        customers: rawState.customers || [],
        vehicles: (rawState.vehicles || []).map((vehicle) => ({
          year: vehicle.year || "",
          make: vehicle.make || "",
          model: vehicle.model || "",
          ...vehicle
        })),
        loyalty: rawState.loyalty || (rawState.customers || []).map((customer) => ({
          id: crypto.randomUUID(),
          customerId: customer.id,
          points: 0,
          tier: customer.loyaltyTier || "None"
        })),
        workOrders: (rawState.workOrders || []).map((workOrder) => ({
          appointmentId: null,
          assignedTechnician: "",
          servicesPerformed: "",
          status: WORK_ORDER_STATUS.ASSIGNED,
          faults: "",
          createdAt: new Date().toISOString(),
          startedAt: "",
          readyForPickupAt: "",
          completedAt: "",
          verifiedAt: "",
          reviewRequestedAt: "",
          invoice: {
            laborCost: 0,
            otherCost: 0,
            otherDescription: "",
            paid: false,
            paidAt: "",
            paidBy: ""
          },
          ...workOrder,
          invoice: {
            laborCost: 0,
            otherCost: 0,
            otherDescription: "",
            paid: false,
            paidAt: "",
            paidBy: "",
            ...(workOrder.invoice || {})
          }
        })),
        workOrderParts: (rawState.workOrderParts || []).map((item) => ({
          unitPrice: 0,
          partName: "",
          sku: "",
          ...item
        })),
        appointments: (rawState.appointments || []).map((appointment) => ({
          bookingNote: "",
          approved: false,
          approvedByAdmin: "",
          assignedOperator: "",
          bay: "",
          estimatedDurationHours: 1,
          status: APPOINTMENT_STATUS.PENDING_APPROVAL,
          faults: "",
          inventoryUsed: "",
          laborStartedAt: "",
          notificationSentAt: "",
          ...appointment
        })),
        inventory: rawState.inventory || []
      };
    }

    function safeParseJSON(value, fallback = null) {
      try {
        return JSON.parse(value);
      } catch {
        return fallback;
      }
      
    }


    function loadState() {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return createDemoState();
      try {
        return safeParseJSON(saved);
      } catch {
        return createDemoState();
      }
    }

    function loadAuth() {
      const saved = localStorage.getItem(AUTH_KEY);
      if (!saved) return null;
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }

    // =============================
    // GLOBAL APP STATE
    // =============================
    let state = loadState();
    let auth = loadAuth();
    let lastSessionPersistAt = Number(auth?.lastActiveAt || 0);
    let selectedInvoiceWorkOrderId = "";
    let invoicePanelNotice = "";

    // =============================
    // DOM ELEMENT REFERENCES
    // =============================
    const elements = {
      loginForm: document.getElementById("loginForm"),
      loginRole: document.getElementById("loginRole"),
      loginEmailField: document.getElementById("loginEmailField"),
      loginPasswordField: document.getElementById("loginPasswordField"),
      loginSubmitButton: document.getElementById("loginSubmitButton"),
      loginMessage: document.getElementById("loginMessage"),
      logoutButton: document.getElementById("logoutButton"),
      sessionName: document.getElementById("sessionName"),
      sessionRole: document.getElementById("sessionRole"),
      heroEyebrow: document.getElementById("heroEyebrow"),
      heroTitle: document.getElementById("heroTitle"),
      heroCopy: document.getElementById("heroCopy"),
      metricCustomers: document.getElementById("metricCustomers"),
      metricVehicles: document.getElementById("metricVehicles"),
      metricOpenOrders: document.getElementById("metricOpenOrders"),
      metricLowStock: document.getElementById("metricLowStock"),
      customerForm: document.getElementById("customerForm"),
      operatorForm: document.getElementById("operatorForm"),
      vehicleForm: document.getElementById("vehicleForm"),
      customerIdField: document.getElementById("customerIdField"),
      operatorIdField: document.getElementById("operatorIdField"),
      customerNameField: document.getElementById("customerNameField"),
      operatorNameField: document.getElementById("operatorNameField"),
      customerAddressField: document.getElementById("customerAddressField"),
      customerPhoneField: document.getElementById("customerPhoneField"),
      customerEmailField: document.getElementById("customerEmailField"),
      operatorEmailField: document.getElementById("operatorEmailField"),
      customerLoyaltyField: document.getElementById("customerLoyaltyField"),
      customerFormMessage: document.getElementById("customerFormMessage"),
      operatorFormMessage: document.getElementById("operatorFormMessage"),
      customerSubmitButton: document.getElementById("customerSubmitButton"),
      operatorSubmitButton: document.getElementById("operatorSubmitButton"),
      customerCancelButton: document.getElementById("customerCancelButton"),
      operatorCancelButton: document.getElementById("operatorCancelButton"),
      workOrderForm: document.getElementById("workOrderForm"),
      workOrderAppointmentSelect: document.getElementById("workOrderAppointmentSelect"),
      workOrderCustomerSelect: document.getElementById("workOrderCustomerSelect"),
      workOrderVehicleSelect: document.getElementById("workOrderVehicleSelect"),
      workOrderServiceSelect: document.getElementById("workOrderServiceSelect"),
      workOrderTechnicianSelect: document.getElementById("workOrderTechnicianSelect"),
      workOrderFaultsField: document.getElementById("workOrderFaultsField"),
      workOrderMessage: document.getElementById("workOrderMessage"),
      workOrderList: document.getElementById("workOrderList"),
      inventoryForm: document.getElementById("inventoryForm"),
      inventoryIdField: document.getElementById("inventoryIdField"),
      inventoryNameField: document.getElementById("inventoryNameField"),
      inventorySkuField: document.getElementById("inventorySkuField"),
      inventoryQuantityField: document.getElementById("inventoryQuantityField"),
      inventoryReorderField: document.getElementById("inventoryReorderField"),
      inventoryPriceField: document.getElementById("inventoryPriceField"),
      inventoryMessage: document.getElementById("inventoryMessage"),
      inventoryList: document.getElementById("inventoryList"),
      inventorySubmitButton: document.getElementById("inventorySubmitButton"),
      inventoryCancelButton: document.getElementById("inventoryCancelButton"),
      searchForm: document.getElementById("searchForm"),
      searchQueryField: document.getElementById("searchQueryField"),
      searchResults: document.getElementById("searchResults"),
      vehicleIdField: document.getElementById("vehicleIdField"),
      customerList: document.getElementById("customerList"),
      operatorList: document.getElementById("operatorList"),
      vehicleList: document.getElementById("vehicleList"),
      customerSummary: document.getElementById("customerSummary"),
      customerPasswordForm: document.getElementById("customerPasswordForm"),
      customerCurrentPassword: document.getElementById("customerCurrentPassword"),
      customerNewPassword: document.getElementById("customerNewPassword"),
      customerConfirmPassword: document.getElementById("customerConfirmPassword"),
      customerPasswordMessage: document.getElementById("customerPasswordMessage"),
      customerPasswordSubmitButton: document.getElementById("customerPasswordSubmitButton"),
      customerVehicleList: document.getElementById("customerVehicleList"),
      customerVehicleForm: document.getElementById("customerVehicleForm"),
      customerVehicleVin: document.getElementById("customerVehicleVin"),
      customerVinValidationMessage: document.getElementById("customerVinValidationMessage"),
      customerVehicleYearField: document.getElementById("customerVehicleYearField"),
      customerVehicleMakeField: document.getElementById("customerVehicleMakeField"),
      customerVehicleModelField: document.getElementById("customerVehicleModelField"),
      customerVehicleMileageField: document.getElementById("customerVehicleMileageField"),
      customerVehicleWarrantyField: document.getElementById("customerVehicleWarrantyField"),
      customerVehicleCodesField: document.getElementById("customerVehicleCodesField"),
      customerVehicleFormMessage: document.getElementById("customerVehicleFormMessage"),
      customerVehicleSubmitButton: document.getElementById("customerVehicleSubmitButton"),
      customerBookingForm: document.getElementById("customerBookingForm"),
      customerBookingVehicleSelect: document.getElementById("customerBookingVehicleSelect"),
      customerBookingServiceSelect: document.getElementById("customerBookingServiceSelect"),
      customerAppointmentAt: document.getElementById("customerAppointmentAt"),
      customerBookingMessage: document.getElementById("customerBookingMessage"),
      customerBookingSubmitButton: document.getElementById("customerBookingSubmitButton"),
      customerAppointmentsTitle: document.getElementById("customerAppointmentsTitle"),
      customerAppointmentList: document.getElementById("customerAppointmentList"),
      customerMaintenanceList: document.getElementById("customerMaintenanceList"),
      appointmentQueueList: document.getElementById("appointmentQueueList"),
      operatorJobList: document.getElementById("operatorJobList"),
      adminBookingForm: document.getElementById("adminBookingForm"),
      adminBookingCustomerSelect: document.getElementById("adminBookingCustomerSelect"),
      adminBookingVehicleSelect: document.getElementById("adminBookingVehicleSelect"),
      adminBookingServiceSelect: document.getElementById("adminBookingServiceSelect"),
      adminAppointmentAt: document.getElementById("adminAppointmentAt"),
      adminBookingMessage: document.getElementById("adminBookingMessage"),
      adminBookingSubmitButton: document.getElementById("adminBookingSubmitButton"),
      adminStatusBoard: document.getElementById("adminStatusBoard"),
      invoiceForm: document.getElementById("invoiceForm"),
      invoiceWorkOrderIdField: document.getElementById("invoiceWorkOrderIdField"),
      invoiceSummary: document.getElementById("invoiceSummary"),
      invoiceLaborCostField: document.getElementById("invoiceLaborCostField"),
      invoiceOtherCostField: document.getElementById("invoiceOtherCostField"),
      invoiceOtherDescriptionField: document.getElementById("invoiceOtherDescriptionField"),
      invoiceMaterialSelect: document.getElementById("invoiceMaterialSelect"),
      invoiceMaterialQuantityField: document.getElementById("invoiceMaterialQuantityField"),
      invoiceAddMaterialButton: document.getElementById("invoiceAddMaterialButton"),
      invoiceMaterialList: document.getElementById("invoiceMaterialList"),
      invoiceTotals: document.getElementById("invoiceTotals"),
      invoiceMessage: document.getElementById("invoiceMessage"),
      invoiceSaveButton: document.getElementById("invoiceSaveButton"),
      invoiceMarkPaidButton: document.getElementById("invoiceMarkPaidButton"),
      ongoingServicesList: document.getElementById("ongoingServicesList"),
      scheduleList: document.getElementById("scheduleList"),
      portalTitle: document.getElementById("portalTitle"),
      vehiclesTitle: document.getElementById("vehiclesTitle"),
      vehicleCustomerSelect: document.getElementById("vehicleCustomerSelect"),
      vehicleVin: document.getElementById("vehicleVin"),
      vinValidationMessage: document.getElementById("vinValidationMessage"),
      vehicleYearField: document.getElementById("vehicleYearField"),
      vehicleMakeField: document.getElementById("vehicleMakeField"),
      vehicleModelField: document.getElementById("vehicleModelField"),
      vehicleMileageField: document.getElementById("vehicleMileageField"),
      vehicleWarrantyField: document.getElementById("vehicleWarrantyField"),
      vehicleCodesField: document.getElementById("vehicleCodesField"),
      vehicleFormMessage: document.getElementById("vehicleFormMessage"),
      vehicleSubmitButton: document.getElementById("vehicleSubmitButton"),
      vehicleCancelButton: document.getElementById("vehicleCancelButton")
    };

    // =============================
    // SHARED STORAGE / UI HELPERS
    // =============================
    const adminOnlyNodes = document.querySelectorAll("[data-admin-only]");
    const customerOnlyNodes = document.querySelectorAll("[data-customer-only]");
    const adminRoleNodes = document.querySelectorAll("[data-admin-role]");

    function persistState() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function persistAuth() {
      localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    }

    function getVehicleDisplayName(vehicle) {
      if (!vehicle) return "Vehicle not found";
      const parts = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean);
      return parts.length ? parts.join(" ") : vehicle.vehicleLabel || "Vehicle";
    }

    function getOperatorUsers() {
      return getAllUsers()
        .filter((user) => user.role === "operator")
        .sort((first, second) => first.name.localeCompare(second.name));
    }

    function getOperatorNames() {
      return getOperatorUsers().map((user) => user.name);
    }

    function formatRecordId(prefix, value) {
      if (!value) return `${prefix}-N/A`;
      const normalized = String(value);
      const segment = normalized.includes("-") ? normalized.split("-").pop() : normalized;
      return `${prefix}-${segment.slice(0, 8).toUpperCase()}`;
    }

    function getLoyaltyRecord(customerId) {
      return state.loyalty.find((item) => item.customerId === customerId) || { points: 0, tier: "None" };
    }

    function hashPassword(value) {
      const normalized = String(value || "").trim();
      let hash = 5381;
      for (let index = 0; index < normalized.length; index += 1) {
        hash = ((hash << 5) + hash) + normalized.charCodeAt(index);
        hash >>>= 0;
      }
      return hash.toString(16).padStart(8, "0");
    }

    // =============================
    // SESSION / AUTH UTILITIES
    // =============================
    function isSessionExpired() {
      if (!auth?.lastActiveAt) return false;
      return Date.now() - Number(auth.lastActiveAt) > SESSION_TIMEOUT_MS;
    }

    function touchSession() {
      if (!auth) return;
      const now = Date.now();
      auth.lastActiveAt = now;

      if (now - lastSessionPersistAt >= SESSION_PERSIST_INTERVAL_MS) {
        persistAuth();
        lastSessionPersistAt = now;
      }
    }

    function clearLoggedOutUiState() {
      elements.loginForm?.reset();
      elements.loginMessage.textContent = "";

      elements.customerForm?.reset();
      if (elements.customerIdField) elements.customerIdField.value = "";
      if (elements.customerSubmitButton) elements.customerSubmitButton.textContent = "Save Customer";
      if (elements.customerCancelButton) elements.customerCancelButton.hidden = true;
      if (elements.customerFormMessage) clearFormMessage(elements.customerFormMessage);

      elements.operatorForm?.reset();
      if (elements.operatorIdField) elements.operatorIdField.value = "";
      if (elements.operatorSubmitButton) elements.operatorSubmitButton.textContent = "Save Operator";
      if (elements.operatorCancelButton) elements.operatorCancelButton.hidden = true;
      if (elements.operatorFormMessage) clearFormMessage(elements.operatorFormMessage);

      elements.vehicleForm?.reset();
      elements.vehicleIdField.value = "";
      elements.vehicleSubmitButton.textContent = "Save Vehicle";
      elements.vehicleCancelButton.hidden = true;
      elements.vehicleMileageField.classList.remove("is-invalid");
      clearVinError();
      clearFormMessage(elements.vehicleFormMessage);

      elements.customerVehicleForm?.reset();
      elements.customerVehicleMileageField?.classList.remove("is-invalid");
      elements.customerVehicleVin?.classList.remove("is-invalid");
      clearFormMessage(elements.customerVehicleFormMessage);
      if (elements.customerVinValidationMessage) {
        elements.customerVinValidationMessage.textContent = "";
      }

      elements.customerBookingForm?.reset();
      clearFormMessage(elements.customerBookingMessage);

      elements.customerPasswordForm?.reset();
      clearFormMessage(elements.customerPasswordMessage);

      elements.adminBookingForm?.reset();
      clearFormMessage(elements.adminBookingMessage);

      elements.invoiceForm?.reset();
      if (elements.invoiceWorkOrderIdField) {
        elements.invoiceWorkOrderIdField.value = "";
      }
      if (elements.invoiceSummary) {
        elements.invoiceSummary.innerHTML = '<article class="empty-state">Select a verified or ready-for-pickup work order to prepare the invoice.</article>';
      }
      if (elements.invoiceMaterialList) {
        elements.invoiceMaterialList.innerHTML = "";
      }
      if (elements.invoiceTotals) {
        elements.invoiceTotals.innerHTML = "";
      }
      clearFormMessage(elements.invoiceMessage);
      selectedInvoiceWorkOrderId = "";
      invoicePanelNotice = "";

      elements.inventoryForm?.reset();
      if (elements.inventoryIdField) {
        elements.inventoryIdField.value = "";
      }
      if (elements.inventorySubmitButton) {
        elements.inventorySubmitButton.textContent = "Save Part";
      }
      if (elements.inventoryCancelButton) {
        elements.inventoryCancelButton.hidden = true;
      }
      clearFormMessage(elements.inventoryMessage);
    }

    function expireSession() {
      auth = null;
      lastSessionPersistAt = 0;
      selectedInvoiceWorkOrderId = "";
      invoicePanelNotice = "";
      localStorage.removeItem(AUTH_KEY);
    }

    // =============================
    // VALIDATION HELPERS
    // =============================
    function isValidVIN(vin) {
      return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin);
    }

    function validateVINInput() {
      const vin = String(elements.vehicleVin.value || "").trim().toUpperCase();
      elements.vehicleVin.value = vin;

      if (!vin) {
        clearVinError();
        return true;
      }

      if (!isValidVIN(vin)) {
        elements.vehicleVin.classList.add("is-invalid");
        elements.vinValidationMessage.textContent = "VIN must be 17 characters and cannot include I, O, or Q.";
        return false;
      }

      clearVinError();
      return true;
    }

    function clearVinError() {
      elements.vehicleVin.classList.remove("is-invalid");
      elements.vinValidationMessage.textContent = "";
    }

    function validateCustomerPortalVIN() {
      const vin = String(elements.customerVehicleVin?.value || "").trim().toUpperCase();
      if (elements.customerVehicleVin) {
        elements.customerVehicleVin.value = vin;
      }

      if (!vin) {
        elements.customerVehicleVin?.classList.remove("is-invalid");
        if (elements.customerVinValidationMessage) {
          elements.customerVinValidationMessage.textContent = "";
        }
        return true;
      }

      if (!isValidVIN(vin)) {
        elements.customerVehicleVin?.classList.add("is-invalid");
        if (elements.customerVinValidationMessage) {
          elements.customerVinValidationMessage.textContent = "VIN must be 17 characters and cannot include I, O, or Q.";
        }
        return false;
      }

      elements.customerVehicleVin?.classList.remove("is-invalid");
      if (elements.customerVinValidationMessage) {
        elements.customerVinValidationMessage.textContent = "";
      }
      return true;
    }

    function setFormMessage(element, message) {
      element.textContent = message;
    }

    function clearFormMessage(element) {
      element.textContent = "";
    }

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
    }

    function setFieldInvalidState(field, isInvalid) {
      if (!field) return;
      field.classList.toggle("is-invalid", Boolean(isInvalid));
    }

    function validateEmailField(field, { required = true } = {}) {
      if (!field) return true;
      const normalizedValue = String(field.value || "").trim().toLowerCase();
      field.value = normalizedValue;

      if (!normalizedValue) {
        setFieldInvalidState(field, required);
        return !required;
      }

      const valid = isValidEmail(normalizedValue);
      setFieldInvalidState(field, !valid);
      return valid;
    }

    function getPasswordComplexityMessage(password) {
      const normalized = String(password || "").trim();
      if (normalized.length < MIN_PASSWORD_LENGTH) {
        return `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
      }
      if (!/\d/.test(normalized) || !/[^A-Za-z0-9]/.test(normalized)) {
        return "Weak password. New password must include at least 1 number and 1 special symbol.";
      }
      return "";
    }

    function updateSubmitButtonState(button, isEnabled) {
      if (!button) return;
      button.disabled = !isEnabled;
      button.setAttribute("aria-disabled", String(!isEnabled));
    }

    function validateLoginFormState() {
      const emailValid = validateEmailField(elements.loginEmailField);
      const passwordValid = String(elements.loginPasswordField?.value || "").trim().length > 0;
      const roleValid = Boolean(elements.loginRole?.value);
      return emailValid && passwordValid && roleValid;
    }

    function validateCustomerPasswordFields({ interactive = false } = {}) {
      const customer = getCurrentCustomer();
      const currentPassword = String(elements.customerCurrentPassword?.value || "");
      const newPassword = String(elements.customerNewPassword?.value || "").trim();
      const confirmPassword = String(elements.customerConfirmPassword?.value || "").trim();

      if (!currentPassword || !newPassword || !confirmPassword) {
        if (interactive) {
          setFormMessage(elements.customerPasswordMessage, "Complete all password fields before saving.");
        }
        return false;
      }

      if (!customer) {
        if (interactive) {
          setFormMessage(elements.customerPasswordMessage, "Customer profile not found.");
        }
        return false;
      }

      const customerUser = state.users.find((user) => user.customerId === customer.id && user.role === "customer");
      const savedPasswordHash = customerUser?.passwordHash || DEFAULT_CUSTOMER_PASSWORD_HASH;
      const currentMatches = hashPassword(currentPassword) === savedPasswordHash;
      setFieldInvalidState(elements.customerCurrentPassword, !currentMatches);
      if (!currentMatches) {
        if (interactive) {
          setFormMessage(elements.customerPasswordMessage, "Current password is incorrect.");
        }
        return false;
      }

      const complexityMessage = getPasswordComplexityMessage(newPassword);
      const passwordStrong = !complexityMessage;
      setFieldInvalidState(elements.customerNewPassword, !passwordStrong);
      if (!passwordStrong) {
        if (interactive) {
          setFormMessage(elements.customerPasswordMessage, complexityMessage);
        }
        return false;
      }

      const passwordsMatch = newPassword === confirmPassword;
      setFieldInvalidState(elements.customerConfirmPassword, !passwordsMatch);
      if (!passwordsMatch) {
        if (interactive) {
          setFormMessage(elements.customerPasswordMessage, "New password and confirmation do not match.");
        }
        return false;
      }

      if (interactive) {
        clearFormMessage(elements.customerPasswordMessage);
      }
      return true;
    }

    function validateCustomerBookingFormState() {
      const appointmentAtValue = String(elements.customerAppointmentAt?.value || "");
      const appointmentAt = new Date(appointmentAtValue);
      if (!elements.customerBookingVehicleSelect?.value || elements.customerBookingVehicleSelect?.disabled) return false;
      if (!elements.customerBookingServiceSelect?.value || elements.customerBookingServiceSelect?.disabled) return false;
      if (!appointmentAtValue || Number.isNaN(appointmentAt.getTime())) return false;
      if (appointmentAt < new Date()) return false;
      if (!isOnTheHour(appointmentAt)) return false;
      if (!isWithinBusinessHours(appointmentAt)) return false;
      return !hasDuplicateAppointment(String(elements.customerBookingVehicleSelect.value), appointmentAt.toISOString());
    }

    function validateAdminBookingFormState() {
      const customerId = String(elements.adminBookingCustomerSelect?.value || "");
      const vehicleId = String(elements.adminBookingVehicleSelect?.value || "");
      const serviceType = String(elements.adminBookingServiceSelect?.value || "");
      const appointmentAtValue = String(elements.adminAppointmentAt?.value || "");
      const appointmentAt = new Date(appointmentAtValue);
      if (!customerId || elements.adminBookingCustomerSelect?.disabled) return false;
      if (!vehicleId || elements.adminBookingVehicleSelect?.disabled) return false;
      if (!serviceType) return false;
      if (!appointmentAtValue || Number.isNaN(appointmentAt.getTime())) return false;
      if (!isOnTheHour(appointmentAt)) return false;
      if (!isWithinBusinessHours(appointmentAt)) return false;
      return !hasDuplicateAppointment(vehicleId, appointmentAt.toISOString());
    }

    function validateInventoryFormState() {
      const name = String(elements.inventoryNameField?.value || "").trim();
      const sku = String(elements.inventorySkuField?.value || "").trim();
      const quantity = Number(elements.inventoryQuantityField?.value);
      const reorderPoint = Number(elements.inventoryReorderField?.value);
      const price = Number(elements.inventoryPriceField?.value);
      if (!name || !sku) return false;
      if (!Number.isFinite(quantity) || quantity < 0) return false;
      if (!Number.isFinite(reorderPoint) || reorderPoint < 0) return false;
      if (!Number.isFinite(price) || price < 0) return false;
      return true;
    }

    function updateLoginValidationState() {
      const isValid = validateLoginFormState();
      updateSubmitButtonState(elements.loginSubmitButton, isValid);
      if (!String(elements.loginEmailField?.value || "").trim()) {
        elements.loginMessage.textContent = "";
      } else if (!isValidEmail(elements.loginEmailField?.value)) {
        elements.loginMessage.textContent = "Enter a valid email address to sign in.";
      } else if (!String(elements.loginPasswordField?.value || "").trim()) {
        elements.loginMessage.textContent = "Enter your password to sign in.";
      } else {
        elements.loginMessage.textContent = "";
      }
    }

    function updateCustomerFormValidationState() {
      const hasEmailValue = Boolean(String(elements.customerEmailField?.value || "").trim());
      const emailValid = validateEmailField(elements.customerEmailField);
      const isValid = validateCustomerForm({ interactive: false });
      updateSubmitButtonState(elements.customerSubmitButton, isValid);
      if (!hasEmailValue) {
        clearFormMessage(elements.customerFormMessage);
      } else if (!emailValid) {
        setFormMessage(elements.customerFormMessage, "Enter a valid email address before saving.");
      } else {
        clearFormMessage(elements.customerFormMessage);
      }
    }

    function updateOperatorFormValidationState() {
      const hasEmailValue = Boolean(String(elements.operatorEmailField?.value || "").trim());
      const emailValid = validateEmailField(elements.operatorEmailField);
      const isValid = validateOperatorForm({ interactive: false });
      updateSubmitButtonState(elements.operatorSubmitButton, isValid);
      if (!hasEmailValue) {
        clearFormMessage(elements.operatorFormMessage);
      } else if (!emailValid) {
        setFormMessage(elements.operatorFormMessage, "Enter a valid operator email before saving.");
      } else {
        clearFormMessage(elements.operatorFormMessage);
      }
    }

    function updateVehicleFormValidationState() {
      const isValid = validateVehicleForm({ interactive: false });
      updateSubmitButtonState(elements.vehicleSubmitButton, isValid);
      if (!String(elements.vehicleVin?.value || "").trim()) {
        clearFormMessage(elements.vehicleFormMessage);
      } else if (!validateVINInput()) {
        setFormMessage(elements.vehicleFormMessage, "Enter a valid VIN before saving.");
      } else {
        clearFormMessage(elements.vehicleFormMessage);
      }
    }

    function updateCustomerVehicleValidationState() {
      const isValid = validateCustomerVehicleForm({ interactive: false });
      updateSubmitButtonState(elements.customerVehicleSubmitButton, isValid);
      if (!String(elements.customerVehicleVin?.value || "").trim()) {
        clearFormMessage(elements.customerVehicleFormMessage);
      } else if (!validateCustomerPortalVIN()) {
        setFormMessage(elements.customerVehicleFormMessage, "Enter a valid VIN before saving.");
      } else {
        clearFormMessage(elements.customerVehicleFormMessage);
      }
    }

    function updateCustomerPasswordValidationState() {
      const currentPassword = String(elements.customerCurrentPassword?.value || "");
      const newPassword = String(elements.customerNewPassword?.value || "").trim();
      const confirmPassword = String(elements.customerConfirmPassword?.value || "").trim();
      const allEmpty = !currentPassword && !newPassword && !confirmPassword;
      const isValid = validateCustomerPasswordFields({ interactive: false });
      updateSubmitButtonState(elements.customerPasswordSubmitButton, isValid);

      if (allEmpty) {
        clearFormMessage(elements.customerPasswordMessage);
        setFieldInvalidState(elements.customerCurrentPassword, false);
        setFieldInvalidState(elements.customerNewPassword, false);
        setFieldInvalidState(elements.customerConfirmPassword, false);
        return;
      }

      if (!currentPassword || !newPassword || !confirmPassword) {
        setFormMessage(elements.customerPasswordMessage, "Complete all password fields before saving.");
        return;
      }

      const complexityMessage = getPasswordComplexityMessage(newPassword);
      if (complexityMessage) {
        setFormMessage(elements.customerPasswordMessage, complexityMessage);
        return;
      }

      if (newPassword !== confirmPassword) {
        setFormMessage(elements.customerPasswordMessage, "New password and confirmation do not match.");
        return;
      }

      if (!isValid) {
        setFormMessage(elements.customerPasswordMessage, "Current password is incorrect.");
        return;
      }

      clearFormMessage(elements.customerPasswordMessage);
    }

    function updateCustomerBookingValidationState() {
      const isValid = validateCustomerBookingFormState();
      updateSubmitButtonState(elements.customerBookingSubmitButton, isValid);
    }

    function updateAdminBookingValidationState() {
      const isValid = validateAdminBookingFormState();
      updateSubmitButtonState(elements.adminBookingSubmitButton, isValid);
    }

    function updateInventoryValidationState() {
      const isValid = validateInventoryFormState();
      updateSubmitButtonState(elements.inventorySubmitButton, isValid);
    }

    function validateCustomerForm({ interactive = true } = {}) {
      const name = elements.customerNameField.value.trim();
      const address = elements.customerAddressField.value.trim();
      const phone = elements.customerPhoneField.value.trim();
      const email = elements.customerEmailField.value.trim();

      if (!name || !address || !phone || !email) {
        if (interactive) {
          setFormMessage(elements.customerFormMessage, "Complete all required customer fields before saving.");
          window.alert("Please complete all required customer fields.");
        }
        return false;
      }

      if (!validateEmailField(elements.customerEmailField)) {
        if (interactive) {
          setFormMessage(elements.customerFormMessage, "Enter a valid email address before saving.");
          window.alert("Enter a valid email address before saving.");
        }
        return false;
      }

      if (interactive) {
        clearFormMessage(elements.customerFormMessage);
      }
      return true;
    }

    function validateOperatorForm({ interactive = true } = {}) {
      const name = elements.operatorNameField.value.trim();
      const email = elements.operatorEmailField.value.trim().toLowerCase();

      if (!name || !email) {
        if (interactive) {
          setFormMessage(elements.operatorFormMessage, "Complete all required operator fields before saving.");
          window.alert("Please complete all required operator fields.");
        }
        return false;
      }

      if (!validateEmailField(elements.operatorEmailField)) {
        if (interactive) {
          setFormMessage(elements.operatorFormMessage, "Enter a valid operator email before saving.");
          window.alert("Enter a valid operator email before saving.");
        }
        return false;
      }

      const duplicateUser = getAllUsers().find((user) =>
        user.email === email && user.id !== String(elements.operatorIdField.value || "")
      );
      if (duplicateUser) {
        if (interactive) {
          setFormMessage(elements.operatorFormMessage, "An operator with that email already exists.");
          window.alert("An operator with that email already exists.");
        }
        return false;
      }

      if (interactive) {
        clearFormMessage(elements.operatorFormMessage);
      }
      return true;
    }

    function validateVehicleForm({ interactive = true } = {}) {
      const customerId = elements.vehicleCustomerSelect.value;
      const year = Number(elements.vehicleYearField.value);
      const make = elements.vehicleMakeField.value.trim();
      const model = elements.vehicleModelField.value.trim();
      const mileage = Number(elements.vehicleMileageField.value);

      if (!customerId || !elements.vehicleVin.value.trim() || !make || !model || elements.vehicleYearField.value.trim() === "" || elements.vehicleMileageField.value.trim() === "") {
        if (interactive) {
          setFormMessage(elements.vehicleFormMessage, "Complete all required vehicle fields before saving.");
          window.alert("Please complete all required vehicle fields.");
        }
        return false;
      }

      if (!validateVINInput()) {
        if (interactive) {
          setFormMessage(elements.vehicleFormMessage, "Enter a valid VIN before saving.");
          window.alert("Enter a valid VIN before saving.");
        }
        return false;
      }

      if (!Number.isInteger(year) || year < 1900 || year > 2099) {
        if (interactive) {
          setFormMessage(elements.vehicleFormMessage, "Enter a valid model year.");
          window.alert("Enter a valid model year.");
        }
        return false;
      }

      if (!Number.isFinite(mileage) || mileage < 0) {
        elements.vehicleMileageField.classList.add("is-invalid");
        if (interactive) {
          setFormMessage(elements.vehicleFormMessage, "Mileage must be a valid positive value.");
          window.alert("Mileage must be a valid positive value.");
        }
        return false;
      }

      elements.vehicleMileageField.classList.remove("is-invalid");
      if (interactive) {
        clearFormMessage(elements.vehicleFormMessage);
      }
      return true;
    }

    // =============================
    // FORM RESET HELPERS
    // =============================
    function resetCustomerForm() {
      elements.customerForm.reset();
      elements.customerIdField.value = "";
      elements.customerSubmitButton.textContent = "Save Customer";
      elements.customerCancelButton.hidden = true;
      setFieldInvalidState(elements.customerEmailField, false);
      clearFormMessage(elements.customerFormMessage);
      updateCustomerFormValidationState();
    }

    function resetOperatorForm() {
      elements.operatorForm?.reset();
      if (elements.operatorIdField) elements.operatorIdField.value = "";
      if (elements.operatorSubmitButton) elements.operatorSubmitButton.textContent = "Save Operator";
      if (elements.operatorCancelButton) elements.operatorCancelButton.hidden = true;
      setFieldInvalidState(elements.operatorEmailField, false);
      if (elements.operatorFormMessage) clearFormMessage(elements.operatorFormMessage);
      updateOperatorFormValidationState();
    }

    function resetVehicleForm() {
      elements.vehicleForm.reset();
      elements.vehicleIdField.value = "";
      elements.vehicleSubmitButton.textContent = "Save Vehicle";
      elements.vehicleCancelButton.hidden = true;
      elements.vehicleMileageField.classList.remove("is-invalid");
      clearVinError();
      clearFormMessage(elements.vehicleFormMessage);
      populateCustomerSelect();
      updateVehicleFormValidationState();
    }

    function resetCustomerVehicleForm() {
      elements.customerVehicleForm?.reset();
      elements.customerVehicleMileageField?.classList.remove("is-invalid");
      elements.customerVehicleVin?.classList.remove("is-invalid");
      clearFormMessage(elements.customerVehicleFormMessage);
      if (elements.customerVinValidationMessage) {
        elements.customerVinValidationMessage.textContent = "";
      }
      updateCustomerVehicleValidationState();
    }

    function resetCustomerBookingForm() {
      elements.customerBookingForm?.reset();
      clearFormMessage(elements.customerBookingMessage);
      populateCustomerBookingVehicleOptions();
      populateCustomerBookingServiceOptions();
      configureAppointmentInputs();
      updateCustomerBookingValidationState();
    }

    function resetCustomerPasswordForm() {
      elements.customerPasswordForm?.reset();
      setFieldInvalidState(elements.customerCurrentPassword, false);
      setFieldInvalidState(elements.customerNewPassword, false);
      setFieldInvalidState(elements.customerConfirmPassword, false);
      clearFormMessage(elements.customerPasswordMessage);
      updateCustomerPasswordValidationState();
    }

    function resetAdminBookingForm() {
      elements.adminBookingForm?.reset();
      clearFormMessage(elements.adminBookingMessage);
      populateAdminBookingSelects();
      configureAppointmentInputs();
      updateAdminBookingValidationState();
    }

    function resetInventoryForm() {
      elements.inventoryForm?.reset();
      if (elements.inventoryIdField) {
        elements.inventoryIdField.value = "";
      }
      if (elements.inventorySubmitButton) {
        elements.inventorySubmitButton.textContent = "Save Part";
      }
      if (elements.inventoryCancelButton) {
        elements.inventoryCancelButton.hidden = true;
      }
      clearFormMessage(elements.inventoryMessage);
      updateInventoryValidationState();
    }

    function resetInvoicePanel() {
      elements.invoiceForm?.reset();
      if (elements.invoiceWorkOrderIdField) {
        elements.invoiceWorkOrderIdField.value = "";
      }
      clearFormMessage(elements.invoiceMessage);
      selectedInvoiceWorkOrderId = "";
      invoicePanelNotice = "";
      renderInvoicePanel();
    }

    // =============================
    // ROLE / ENTITY LOOKUPS
    // =============================
    function isCustomerUser() {
      return auth?.role === "customer";
    }

    function isStaffUser() {
      return ["admin", "operator"].includes(auth?.role);
    }

    function isAdminUser() {
      return auth?.role === "admin";
    }

    function findCustomer(customerId) {
      return state.customers.find((customer) => customer.id === customerId);
    }

    function findVehicle(vehicleId) {
      return state.vehicles.find((vehicle) => vehicle.id === vehicleId);
    }

    function findWorkOrder(workOrderId) {
      return state.workOrders.find((workOrder) => workOrder.id === workOrderId);
    }

    function findWorkOrderByAppointment(appointmentId) {
      return state.workOrders.find((workOrder) => workOrder.appointmentId === appointmentId);
    }

    function getInvoiceState(workOrder) {
      return {
        laborCost: 0,
        otherCost: 0,
        otherDescription: "",
        paid: false,
        paidAt: "",
        paidBy: "",
        ...(workOrder?.invoice || {})
      };
    }

    function getWorkOrderMaterialLines(workOrderId) {
      return state.workOrderParts
        .filter((item) => item.workOrderId === workOrderId)
        .map((item) => {
          const inventoryPart = state.inventory.find((part) => part.id === item.partId);
          const unitPrice = Number(item.unitPrice ?? inventoryPart?.price ?? 0);
          const quantity = Number(item.quantity || 0);
          return {
            ...item,
            displayName: item.partName || inventoryPart?.name || "Inventory item",
            sku: item.sku || inventoryPart?.sku || "",
            unitPrice,
            quantity,
            lineTotal: unitPrice * quantity
          };
        });
    }

    function getWorkOrderInvoiceTotals(workOrder) {
      const invoice = getInvoiceState(workOrder);
      const materials = getWorkOrderMaterialLines(workOrder.id);
      const materialsTotal = materials.reduce((sum, item) => sum + item.lineTotal, 0);
      const laborCost = Number(invoice.laborCost || 0);
      const otherCost = Number(invoice.otherCost || 0);
      return {
        materials,
        materialsTotal,
        laborCost,
        otherCost,
        grandTotal: laborCost + materialsTotal + otherCost,
        invoice
      };
    }

    function getCurrentCustomer() {
      return auth?.customerId ? findCustomer(auth.customerId) : null;
    }

    function getCurrentCustomerVehicles() {
      const customer = getCurrentCustomer();
      return state.vehicles.filter((vehicle) => vehicle.customerId === customer?.id);
    }

    function getCurrentCustomerAppointments() {
      const customer = getCurrentCustomer();
      return state.appointments
        .filter((appointment) => appointment.customerId === customer?.id)
        .sort((first, second) => new Date(first.appointmentAt) - new Date(second.appointmentAt));
    }

    // =============================
    // DATE / DISPLAY FORMATTING
    // =============================
    function getMinDatetimeLocal() {
      const now = new Date();
      const nextHour = new Date(now);
      if (nextHour.getMinutes() > 0 || nextHour.getSeconds() > 0 || nextHour.getMilliseconds() > 0) {
        nextHour.setHours(nextHour.getHours() + 1);
      }
      nextHour.setMinutes(0, 0, 0);
      const year = now.getFullYear();
      const month = String(nextHour.getMonth() + 1).padStart(2, "0");
      const day = String(nextHour.getDate()).padStart(2, "0");
      const hours = String(nextHour.getHours()).padStart(2, "0");
      const minutes = String(nextHour.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    function formatDate(value) {
      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(new Date(value));
    }

    function formatCurrency(value) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(Number(value || 0));
    }

    function getDaysUntilAppointment(value) {
      const now = new Date();
      const appointmentDate = new Date(value);
      const millisecondsLeft = appointmentDate.getTime() - now.getTime();
      const daysLeft = Math.ceil(millisecondsLeft / (1000 * 60 * 60 * 24));

      if (daysLeft < 0) return "Appointment time has passed";
      if (daysLeft === 0) return "Appointment is today";
      if (daysLeft === 1) return "1 day until appointment";
      return `${daysLeft} days until appointment`;
    }

    function isWithinBusinessHours(date) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const totalMinutes = (hours * 60) + minutes;
      const openMinutes = 9 * 60;
      const closeMinutes = 17 * 60;
      return totalMinutes >= openMinutes && totalMinutes <= closeMinutes;
    }

    function isOnTheHour(date) {
      return date.getMinutes() === 0 && date.getSeconds() === 0;
    }

    function configureAppointmentInputs() {
      const minValue = getMinDatetimeLocal();
      [elements.customerAppointmentAt, elements.adminAppointmentAt].forEach((input) => {
        if (!input) return;
        input.min = minValue;
        input.step = 3600;
      });
    }

    // =============================
    // APPOINTMENT / CAPACITY RULES
    // =============================
    function hasDuplicateAppointment(vehicleId, appointmentAt, excludeAppointmentId = "") {
      return state.appointments.some((appointment) =>
        appointment.id !== excludeAppointmentId &&
        appointment.vehicleId === vehicleId &&
        appointment.appointmentAt === appointmentAt &&
        ACTIVE_APPOINTMENT_STATUSES.includes(appointment.status || APPOINTMENT_STATUS.PENDING_APPROVAL)
      );
    }

    function appointmentBlocksBay(appointment) {
      return [
        APPOINTMENT_STATUS.ASSIGNED,
        APPOINTMENT_STATUS.IN_PROGRESS,
        APPOINTMENT_STATUS.WAITING_FOR_PARTS,
        APPOINTMENT_STATUS.WAITING_FOR_APPROVAL,
        APPOINTMENT_STATUS.ON_HOLD,
        APPOINTMENT_STATUS.WORK_COMPLETED,
        APPOINTMENT_STATUS.VERIFIED
      ].includes(appointment.status);
    }

    function appointmentBlocksOperator(appointment) {
      return [
        APPOINTMENT_STATUS.ASSIGNED,
        APPOINTMENT_STATUS.IN_PROGRESS,
        APPOINTMENT_STATUS.WAITING_FOR_PARTS,
        APPOINTMENT_STATUS.WAITING_FOR_APPROVAL,
        APPOINTMENT_STATUS.ON_HOLD,
        APPOINTMENT_STATUS.WORK_COMPLETED,
        APPOINTMENT_STATUS.VERIFIED,
        APPOINTMENT_STATUS.READY_FOR_PICKUP
      ].includes(appointment.status);
    }

    function isBayUnavailable(bay, appointmentAt, excludeAppointmentId = "") {
      return state.appointments.some((appointment) =>
        appointment.id !== excludeAppointmentId &&
        appointmentBlocksBay(appointment) &&
        appointment.bay === bay &&
        appointment.appointmentAt === appointmentAt
      );
    }

    function isOperatorDoubleBooked(operatorName, appointmentAt, excludeAppointmentId = "") {
      return state.appointments.some((appointment) =>
        appointment.id !== excludeAppointmentId &&
        appointmentBlocksOperator(appointment) &&
        appointment.assignedOperator === operatorName &&
        appointment.appointmentAt === appointmentAt
      );
    }

    function getAssignmentConflictSummary(appointment) {
      const conflicts = [];
      if (appointment.assignedOperator && isOperatorDoubleBooked(appointment.assignedOperator, appointment.appointmentAt, appointment.id)) {
        conflicts.push(`${appointment.assignedOperator} is already booked at this time`);
      }
      if (appointment.bay && isBayUnavailable(appointment.bay, appointment.appointmentAt, appointment.id)) {
        conflicts.push(`${appointment.bay} is already occupied at this time`);
      }
      return conflicts;
    }

    function isOperatorUser() {
      return auth?.role === "operator";
    }

    function isServiceUser() {
      return auth?.role === "operator";
    }

    function getTechnicianProfile(technicianName) {
      return TECHNICIAN_PROFILES[technicianName] || {
        skills: SERVICE_CATALOG.map((service) => service.name),
        maxConcurrentJobs: 2
      };
    }

    function isTechnicianSkilledForService(technicianName, serviceType) {
      const profile = getTechnicianProfile(technicianName);
      return profile.skills.includes(serviceType) || serviceType === "General Repair";
    }

    function getTechnicianActiveJobs(technicianName, excludeAppointmentId = "") {
      return state.appointments.filter((appointment) =>
        appointment.id !== excludeAppointmentId &&
        appointment.assignedOperator === technicianName &&
        [APPOINTMENT_STATUS.ASSIGNED, APPOINTMENT_STATUS.IN_PROGRESS, APPOINTMENT_STATUS.WAITING_FOR_PARTS, APPOINTMENT_STATUS.WAITING_FOR_APPROVAL, APPOINTMENT_STATUS.ON_HOLD].includes(appointment.status)
      );
    }

    function isTechnicianAvailable(technicianName, serviceType, excludeAppointmentId = "") {
      const profile = getTechnicianProfile(technicianName);
      if (!isTechnicianSkilledForService(technicianName, serviceType)) {
        window.alert(`${technicianName} is not assigned to that service type.`);
        return false;
      }
      const appointment = state.appointments.find((item) => item.id === excludeAppointmentId);
      if (appointment && isOperatorDoubleBooked(technicianName, appointment.appointmentAt, excludeAppointmentId)) {
        window.alert(`${technicianName} already has another appointment scheduled at ${formatDate(appointment.appointmentAt)}.`);
        return false;
      }
      if (getTechnicianActiveJobs(technicianName, excludeAppointmentId).length >= profile.maxConcurrentJobs) {
        window.alert(`${technicianName} is already at max active capacity.`);
        return false;
      }
      return true;
    }

    // =============================
    // WORK ORDER + APPOINTMENT FLOW
    // =============================
    function syncAppointmentStatusFromWorkOrder(workOrder, nextStatus, timestamp) {
      if (!workOrder?.appointmentId) return;

      state.appointments = state.appointments.map((appointment) => {
        if (appointment.id !== workOrder.appointmentId) {
          return appointment;
        }

        const update = { ...appointment, status: nextStatus };
        if (nextStatus === APPOINTMENT_STATUS.IN_PROGRESS && !appointment.laborStartedAt) {
          update.laborStartedAt = timestamp;
        }
        if (nextStatus === APPOINTMENT_STATUS.READY_FOR_PICKUP && !appointment.notificationSentAt) {
          update.notificationSentAt = timestamp;
        }
        return update;
      });
    }

    function getCustomerVisibleAppointmentStatus(status) {
      if (status === APPOINTMENT_STATUS.PENDING_APPROVAL) return "PENDING_APPROVAL";
      if (status === APPOINTMENT_STATUS.REJECTED) return "REJECTED";
      if (status === APPOINTMENT_STATUS.READY_FOR_PICKUP) return "READY_FOR_PICKUP";
      if (status === APPOINTMENT_STATUS.COMPLETED) return "COMPLETED";
      return "SCHEDULED";
    }

    function populateAdminBookingSelects() {
      if (!elements.adminBookingCustomerSelect) return;

      const currentCustomer = elements.adminBookingCustomerSelect.value;
      elements.adminBookingCustomerSelect.innerHTML = state.customers.length
        ? state.customers.map((customer) => `<option value="${customer.id}">${customer.name}</option>`).join("")
        : '<option value="">Add a customer first</option>';
      elements.adminBookingCustomerSelect.disabled = state.customers.length === 0;

      if (currentCustomer && state.customers.some((customer) => customer.id === currentCustomer)) {
        elements.adminBookingCustomerSelect.value = currentCustomer;
      }

      const selectedCustomerId = elements.adminBookingCustomerSelect.value;
      const customerVehicles = state.vehicles.filter((vehicle) => vehicle.customerId === selectedCustomerId);
      elements.adminBookingVehicleSelect.innerHTML = customerVehicles.length
        ? customerVehicles.map((vehicle) => `<option value="${vehicle.id}">${getVehicleDisplayName(vehicle)}</option>`).join("")
        : '<option value="">Add a vehicle first</option>';
      elements.adminBookingVehicleSelect.disabled = customerVehicles.length === 0;

      elements.adminBookingServiceSelect.innerHTML = SERVICE_CATALOG
        .map((service) => `<option value="${service.name}">${service.name}</option>`)
        .join("");
      updateAdminBookingValidationState();
    }

    function createWorkOrderFromAppointment(appointment) {
      const existingWorkOrder = findWorkOrderByAppointment(appointment.id);
      if (existingWorkOrder) {
        return existingWorkOrder;
      }

      const workOrder = {
        id: crypto.randomUUID(),
        customerId: appointment.customerId,
        vehicleId: appointment.vehicleId,
        appointmentId: appointment.id,
        assignedTechnician: appointment.assignedOperator || "",
        servicesPerformed: appointment.serviceType,
        status: WORK_ORDER_STATUS.ASSIGNED,
        faults: appointment.faults || "",
        createdAt: new Date().toISOString(),
        startedAt: "",
        readyForPickupAt: "",
        completedAt: "",
        verifiedAt: "",
        reviewRequestedAt: "",
        invoice: {
          laborCost: 0,
          otherCost: 0,
          otherDescription: "",
          paid: false,
          paidAt: "",
          paidBy: ""
        }
      };

      state.workOrders.unshift(workOrder);
      return workOrder;
    }

    function logOperatorWorkUpdate(workOrderId) {
      const workOrder = findWorkOrder(workOrderId);
      if (!workOrder) return;

      const nextFaults = window.prompt("Update work notes or findings for this job.", workOrder.faults || "");
      if (nextFaults === null) return;

      const partsInput = window.prompt(
        "Optional: add used parts as comma-separated SKU entries. Examples: 352777, 352777:2, M1-5W30-5QT:1",
        ""
      );
      if (partsInput === null) return;

      const normalizedParts = partsInput
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (normalizedParts.length) {
        const consumed = consumeInventoryForWorkOrder(workOrderId, normalizedParts);
        if (!consumed) {
          return;
        }
      }

      state.workOrders = state.workOrders.map((item) =>
        item.id === workOrderId
          ? {
              ...item,
              faults: nextFaults.trim()
            }
          : item
      );

      if (workOrder.appointmentId) {
        state.appointments = state.appointments.map((item) =>
          item.id === workOrder.appointmentId
            ? {
                ...item,
                faults: nextFaults.trim()
              }
            : item
        );
      }

      if (normalizedParts.length) {
        syncAppointmentInventorySummary(workOrder.appointmentId);
      }

      persistState();
      render();
    }

    function consumeInventoryForWorkOrder(workOrderId, skuEntries) {
      const requestedParts = [];

      for (const skuEntry of skuEntries) {
        const [rawSku, rawQuantity] = skuEntry.split(":").map((item) => item.trim());
        const normalizedSku = String(rawSku || "").toUpperCase();
        const quantity = rawQuantity ? Number(rawQuantity) : 1;

        if (!normalizedSku) {
          window.alert("Enter a valid SKU when logging used inventory.");
          return false;
        }

        if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
          window.alert(`Enter a valid whole-number quantity for SKU ${normalizedSku}.`);
          return false;
        }

        const matchedPart = state.inventory.find((part) => String(part.sku || "").toUpperCase() === normalizedSku);
        if (!matchedPart) {
          window.alert(`Inventory item with SKU "${normalizedSku}" was not found in the catalog.`);
          return false;
        }

        const existingRequest = requestedParts.find((item) => item.part.id === matchedPart.id);
        if (existingRequest) {
          existingRequest.quantity += quantity;
        } else {
          requestedParts.push({ part: matchedPart, quantity });
        }
      }

      for (const { part, quantity } of requestedParts) {
        if (part.quantity < quantity) {
          window.alert(`Only ${part.quantity} of ${part.name} (SKU ${part.sku}) are available.`);
          return false;
        }
      }

      requestedParts.forEach(({ part, quantity }) => {
        state.inventory = state.inventory.map((inventoryPart) =>
          inventoryPart.id === part.id
            ? { ...inventoryPart, quantity: inventoryPart.quantity - quantity }
            : inventoryPart
        );

        const existingPartLink = state.workOrderParts.find((item) => item.workOrderId === workOrderId && item.partId === part.id);
        if (existingPartLink) {
          state.workOrderParts = state.workOrderParts.map((item) =>
            item.workOrderId === workOrderId && item.partId === part.id
              ? { ...item, quantity: item.quantity + quantity, unitPrice: item.unitPrice || part.price, partName: item.partName || part.name, sku: item.sku || part.sku }
              : item
          );
        } else {
          state.workOrderParts.push({
            id: crypto.randomUUID(),
            workOrderId,
            partId: part.id,
            quantity,
            unitPrice: part.price,
            partName: part.name,
            sku: part.sku
          });
        }
      });

      return true;
    }

    function syncAppointmentInventorySummary(appointmentId) {
      if (!appointmentId) return;

      const workOrder = findWorkOrderByAppointment(appointmentId);
      if (!workOrder) return;

      const summary = state.workOrderParts
        .filter((item) => item.workOrderId === workOrder.id)
        .map((item) => {
          const part = state.inventory.find((inventoryPart) => inventoryPart.id === item.partId);
          const partName = item.partName || part?.name;
          const sku = item.sku || part?.sku;
          return partName && sku ? `${partName} (SKU ${sku}) x${item.quantity}` : "";
        })
        .filter(Boolean)
        .join(", ");

      state.appointments = state.appointments.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, inventoryUsed: summary }
          : appointment
      );
    }

    function addInventoryToWorkOrder(workOrderId, partId, quantity) {
      const workOrder = findWorkOrder(workOrderId);
      if (!workOrder) return false;

      const matchedPart = state.inventory.find((part) => part.id === partId);
      if (!matchedPart) {
        window.alert("Choose an inventory item to use.");
        return false;
      }

      const parsedQuantity = Number(quantity);
      if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
        window.alert("Enter a valid positive quantity.");
        return false;
      }

      if (matchedPart.quantity < parsedQuantity) {
        window.alert(`Only ${matchedPart.quantity} of ${matchedPart.name} are available.`);
        return false;
      }

      state.inventory = state.inventory.map((part) =>
        part.id === partId
          ? { ...part, quantity: part.quantity - parsedQuantity }
          : part
      );

      const existingPartLink = state.workOrderParts.find((item) => item.workOrderId === workOrderId && item.partId === partId);
      if (existingPartLink) {
        state.workOrderParts = state.workOrderParts.map((item) =>
          item.workOrderId === workOrderId && item.partId === partId
            ? { ...item, quantity: item.quantity + parsedQuantity, unitPrice: item.unitPrice || matchedPart.price, partName: item.partName || matchedPart.name, sku: item.sku || matchedPart.sku }
            : item
        );
      } else {
        state.workOrderParts.push({
          id: crypto.randomUUID(),
          workOrderId,
          partId,
          quantity: parsedQuantity,
          unitPrice: matchedPart.price,
          partName: matchedPart.name,
          sku: matchedPart.sku
        });
      }

      syncAppointmentInventorySummary(workOrder.appointmentId);
      persistState();
      render();
      return true;
    }

    function removeInventoryFromWorkOrder(workOrderId, partId) {
      const workOrder = findWorkOrder(workOrderId);
      if (!workOrder) return false;

      const existingPartLink = state.workOrderParts.find((item) => item.workOrderId === workOrderId && item.partId === partId);
      if (!existingPartLink) {
        window.alert("That material is not attached to this work order.");
        return false;
      }

      state.inventory = state.inventory.map((part) =>
        part.id === partId
          ? { ...part, quantity: part.quantity + Number(existingPartLink.quantity || 0) }
          : part
      );
      state.workOrderParts = state.workOrderParts.filter((item) => item !== existingPartLink);
      syncAppointmentInventorySummary(workOrder.appointmentId);
      invoicePanelNotice = "Material removed from the invoice and returned to inventory.";
      persistState();
      render();
      return true;
    }

    function saveInvoiceDraft(options = {}) {
      if (!isAdminUser()) return false;

      const workOrderId = String(options.workOrderId || elements.invoiceWorkOrderIdField?.value || selectedInvoiceWorkOrderId || "");
      const workOrder = findWorkOrder(workOrderId);
      if (!workOrder) {
        window.alert("Select a work order before saving the invoice.");
        return false;
      }

      const laborCost = Number(elements.invoiceLaborCostField?.value || 0);
      const otherCost = Number(elements.invoiceOtherCostField?.value || 0);
      const otherDescription = String(elements.invoiceOtherDescriptionField?.value || "").trim();

      if (!Number.isFinite(laborCost) || laborCost < 0 || !Number.isFinite(otherCost) || otherCost < 0) {
        setFormMessage(elements.invoiceMessage, "Labor and other charges must be zero or greater.");
        window.alert("Labor and other charges must be zero or greater.");
        return false;
      }

      const currentInvoice = getInvoiceState(workOrder);
      state.workOrders = state.workOrders.map((item) =>
        item.id === workOrderId
          ? {
              ...item,
              invoice: {
                ...currentInvoice,
                laborCost,
                otherCost,
                otherDescription
              }
            }
          : item
      );

      selectedInvoiceWorkOrderId = workOrderId;
      persistState();
      render();
      setFormMessage(elements.invoiceMessage, options.message || "Invoice saved.");
      return true;
    }

    function openInvoiceForWorkOrder(workOrderId, notice = "") {
      const workOrder = findWorkOrder(workOrderId);
      if (!workOrder) return;
      selectedInvoiceWorkOrderId = workOrderId;
      invoicePanelNotice = notice;
      render();
      elements.invoiceForm?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function markInvoicePaid() {
      if (!isAdminUser()) return;

      const saved = saveInvoiceDraft({ message: "Invoice saved before payment confirmation." });
      if (!saved) return;

      const workOrderId = String(elements.invoiceWorkOrderIdField?.value || selectedInvoiceWorkOrderId || "");
      const workOrder = findWorkOrder(workOrderId);
      if (!workOrder) return;

      if (!confirmAdminPassword(`mark invoice ${formatRecordId("WO", workOrder.id)} as paid`)) return;

      const currentInvoice = getInvoiceState(workOrder);
      state.workOrders = state.workOrders.map((item) =>
        item.id === workOrderId
          ? {
              ...item,
              invoice: {
                ...currentInvoice,
                laborCost: Number(elements.invoiceLaborCostField?.value || 0),
                otherCost: Number(elements.invoiceOtherCostField?.value || 0),
                otherDescription: String(elements.invoiceOtherDescriptionField?.value || "").trim(),
                paid: true,
                paidAt: new Date().toISOString(),
                paidBy: auth.name
              }
            }
          : item
      );

      persistState();
      render();
      setFormMessage(elements.invoiceMessage, "Invoice marked paid. Complete Pickup is now available.");
    }

    function renderInvoicePanel() {
      if (!isAdminUser() || !elements.invoiceSummary || !elements.invoiceMaterialList || !elements.invoiceTotals) return;

      const workOrder = findWorkOrder(selectedInvoiceWorkOrderId);
      if (!workOrder) {
        selectedInvoiceWorkOrderId = "";
        if (elements.invoiceWorkOrderIdField) {
          elements.invoiceWorkOrderIdField.value = "";
        }
        elements.invoiceSummary.innerHTML = '<article class="empty-state">Select a verified or ready-for-pickup work order to prepare the invoice.</article>';
        elements.invoiceMaterialList.innerHTML = "";
        elements.invoiceTotals.innerHTML = "";
        if (elements.invoiceMaterialSelect) {
          elements.invoiceMaterialSelect.innerHTML = '<option value="">Select a work order first</option>';
          elements.invoiceMaterialSelect.disabled = true;
        }
        if (elements.invoiceAddMaterialButton) {
          elements.invoiceAddMaterialButton.disabled = true;
        }
        if (elements.invoiceSaveButton) {
          elements.invoiceSaveButton.disabled = true;
        }
        if (elements.invoiceMarkPaidButton) {
          elements.invoiceMarkPaidButton.disabled = true;
          elements.invoiceMarkPaidButton.textContent = "Mark Paid";
        }
        if (elements.invoiceMaterialQuantityField) {
          elements.invoiceMaterialQuantityField.value = "1";
        }
        if (elements.invoiceLaborCostField) {
          elements.invoiceLaborCostField.value = "";
        }
        if (elements.invoiceOtherCostField) {
          elements.invoiceOtherCostField.value = "";
        }
        if (elements.invoiceOtherDescriptionField) {
          elements.invoiceOtherDescriptionField.value = "";
        }
        clearFormMessage(elements.invoiceMessage);
        return;
      }

      const customer = findCustomer(workOrder.customerId);
      const vehicle = findVehicle(workOrder.vehicleId);
      const appointment = workOrder.appointmentId ? state.appointments.find((item) => item.id === workOrder.appointmentId) : null;
      const { materials, materialsTotal, laborCost, otherCost, grandTotal, invoice } = getWorkOrderInvoiceTotals(workOrder);
      const availableParts = state.inventory.filter((part) => part.quantity > 0);

      if (elements.invoiceWorkOrderIdField) {
        elements.invoiceWorkOrderIdField.value = workOrder.id;
      }
      if (elements.invoiceLaborCostField) {
        elements.invoiceLaborCostField.value = String(laborCost || "");
      }
      if (elements.invoiceOtherCostField) {
        elements.invoiceOtherCostField.value = String(otherCost || "");
      }
      if (elements.invoiceOtherDescriptionField) {
        elements.invoiceOtherDescriptionField.value = invoice.otherDescription || "";
      }
      if (elements.invoiceMaterialSelect) {
        elements.invoiceMaterialSelect.innerHTML = availableParts.length
          ? availableParts.map((part) => `<option value="${part.id}">${part.name} (SKU ${part.sku}) · ${part.quantity} in stock · ${formatCurrency(part.price)}</option>`).join("")
          : '<option value="">No stocked materials available</option>';
        elements.invoiceMaterialSelect.disabled = availableParts.length === 0;
      }
      if (elements.invoiceAddMaterialButton) {
        elements.invoiceAddMaterialButton.disabled = availableParts.length === 0;
      }
      if (elements.invoiceSaveButton) {
        elements.invoiceSaveButton.disabled = false;
      }
      if (elements.invoiceMarkPaidButton) {
        elements.invoiceMarkPaidButton.textContent = invoice.paid ? "Payment Recorded" : "Mark Paid";
        elements.invoiceMarkPaidButton.disabled = invoice.paid;
      }

      elements.invoiceSummary.innerHTML = `
        <article class="list-card">
          <h4>${workOrder.servicesPerformed || "Service work"}</h4>
          <p>${customer?.name || "Unknown customer"} · ${getVehicleDisplayName(vehicle)}</p>
          <div class="stack-meta">
            <span class="pill">${formatRecordId("WO", workOrder.id)}</span>
            <span class="pill">${formatRecordId("APT", workOrder.appointmentId)}</span>
            <span class="pill">${workOrder.status}</span>
            <span class="pill">${invoice.paid ? `Paid ${formatDate(invoice.paidAt)}` : "Unpaid"}</span>
          </div>
          <div class="stack-meta">
            <span class="pill">${appointment?.assignedOperator || workOrder.assignedTechnician || "Operator not assigned"}</span>
            <span class="pill">${appointment?.bay || "Bay not assigned"}</span>
            <span class="pill">${appointment ? formatDate(appointment.appointmentAt) : "No appointment time"}</span>
          </div>
          <p>${workOrder.faults || appointment?.faults || "No work notes recorded yet."}</p>
        </article>
      `;

      elements.invoiceMaterialList.innerHTML = materials.length
        ? materials.map((item) => `
          <article class="list-card">
            <h4>${item.displayName}</h4>
            <div class="stack-meta">
              <span class="pill">SKU ${item.sku || "N/A"}</span>
              <span class="pill">Qty ${item.quantity}</span>
              <span class="pill">${formatCurrency(item.unitPrice)} each</span>
              <span class="pill">${formatCurrency(item.lineTotal)}</span>
            </div>
            <div class="list-actions">
              <button type="button" class="secondary-btn" data-remove-invoice-material="${item.partId}">Remove Material</button>
            </div>
          </article>
        `).join("")
        : '<article class="empty-state">No billed materials yet. Add materials from inventory if they were used on this job.</article>';

      elements.invoiceTotals.innerHTML = `
        <article class="list-card">
          <h4>Invoice Totals</h4>
          <div class="stack-meta">
            <span class="pill">Labor ${formatCurrency(laborCost)}</span>
            <span class="pill">Materials ${formatCurrency(materialsTotal)}</span>
            <span class="pill">Other ${formatCurrency(otherCost)}</span>
            <span class="pill">Grand Total ${formatCurrency(grandTotal)}</span>
          </div>
          <p>${invoice.otherDescription || "No other-charge note added."}</p>
          <p>${invoice.paid ? `Paid by ${invoice.paidBy || "Admin"} on ${formatDate(invoice.paidAt)}.` : "Payment has not been recorded yet."}</p>
        </article>
      `;

      elements.invoiceMaterialList.querySelectorAll("[data-remove-invoice-material]").forEach((button) => {
        button.addEventListener("click", () => removeInventoryFromWorkOrder(workOrder.id, button.dataset.removeInvoiceMaterial));
      });

      if (invoicePanelNotice) {
        setFormMessage(elements.invoiceMessage, invoicePanelNotice);
        invoicePanelNotice = "";
      } else if (!invoice.paid) {
        setFormMessage(elements.invoiceMessage, "Review labor, materials, and other charges before marking this invoice paid.");
      } else {
        setFormMessage(elements.invoiceMessage, "Payment has been recorded. Complete Pickup is now unlocked.");
      }
    }

    function updateWorkOrderStatus(workOrderId, nextStatus) {
      const workOrder = findWorkOrder(workOrderId);
      if (!workOrder) return;

      const allowedTransitions = {
        [WORK_ORDER_STATUS.ASSIGNED]: [WORK_ORDER_STATUS.IN_PROGRESS],
        [WORK_ORDER_STATUS.IN_PROGRESS]: [WORK_ORDER_STATUS.WAITING_FOR_PARTS, WORK_ORDER_STATUS.WAITING_FOR_APPROVAL, WORK_ORDER_STATUS.ON_HOLD, WORK_ORDER_STATUS.WORK_COMPLETED],
        [WORK_ORDER_STATUS.WAITING_FOR_PARTS]: [WORK_ORDER_STATUS.IN_PROGRESS, WORK_ORDER_STATUS.ON_HOLD],
        [WORK_ORDER_STATUS.WAITING_FOR_APPROVAL]: [WORK_ORDER_STATUS.IN_PROGRESS, WORK_ORDER_STATUS.ON_HOLD],
        [WORK_ORDER_STATUS.ON_HOLD]: [WORK_ORDER_STATUS.IN_PROGRESS, WORK_ORDER_STATUS.WAITING_FOR_PARTS, WORK_ORDER_STATUS.WAITING_FOR_APPROVAL],
        [WORK_ORDER_STATUS.WORK_COMPLETED]: [],
        [WORK_ORDER_STATUS.VERIFIED]: [],
        [WORK_ORDER_STATUS.READY_FOR_PICKUP]: [],
        [WORK_ORDER_STATUS.COMPLETED]: []
      };

      if (!(allowedTransitions[workOrder.status] || []).includes(nextStatus)) {
        window.alert(`Cannot move a work order from ${workOrder.status} to ${nextStatus}.`);
        return;
      }

      let faults = workOrder.faults || "";

      if (nextStatus === WORK_ORDER_STATUS.WORK_COMPLETED) {
        const promptedFaults = window.prompt("Update faults before closing this work order.", workOrder.faults || "");
        if (promptedFaults === null) return;
        faults = promptedFaults.trim();
      }

      const timestamp = new Date().toISOString();
      state.workOrders = state.workOrders.map((item) =>
        item.id === workOrderId
          ? {
              ...item,
              status: nextStatus,
              faults: nextStatus === WORK_ORDER_STATUS.WORK_COMPLETED ? faults : item.faults,
              startedAt: nextStatus === WORK_ORDER_STATUS.IN_PROGRESS && !item.startedAt ? timestamp : item.startedAt,
              readyForPickupAt: nextStatus === WORK_ORDER_STATUS.READY_FOR_PICKUP ? timestamp : item.readyForPickupAt,
              completedAt: nextStatus === WORK_ORDER_STATUS.COMPLETED ? timestamp : item.completedAt,
              verifiedAt: nextStatus === WORK_ORDER_STATUS.VERIFIED ? timestamp : item.verifiedAt,
              reviewRequestedAt: nextStatus === WORK_ORDER_STATUS.WORK_COMPLETED ? timestamp : item.reviewRequestedAt
            }
          : item
      );

      syncAppointmentStatusFromWorkOrder(workOrder, nextStatus, timestamp);

      if (workOrder.appointmentId && nextStatus === WORK_ORDER_STATUS.WORK_COMPLETED) {
        syncAppointmentInventorySummary(workOrder.appointmentId);
        state.appointments = state.appointments.map((item) =>
          item.id === workOrder.appointmentId
            ? { ...item, faults }
            : item
        );
      }

      persistState();
      render();
    }

    function editAppointmentDetails(appointmentId) {
      const appointment = state.appointments.find((item) => item.id === appointmentId);
      if (!appointment) return;

      const nextServiceType = window.prompt("Update service type for this appointment.", appointment.serviceType);
      if (nextServiceType === null) return;

      const currentLocal = appointment.appointmentAt.slice(0, 16);
      const nextAppointmentAt = window.prompt("Update appointment time in YYYY-MM-DDTHH:MM format.", currentLocal);
      if (nextAppointmentAt === null) return;

      const parsedDate = new Date(nextAppointmentAt);
      if (Number.isNaN(parsedDate.getTime())) {
        window.alert("Enter a valid appointment date and time.");
        return;
      }

      if (!isOnTheHour(parsedDate)) {
        window.alert("Appointments must stay scheduled on the hour.");
        return;
      }

      if (!isWithinBusinessHours(parsedDate)) {
        window.alert("Appointments must stay within business hours.");
        return;
      }

      const nextIso = parsedDate.toISOString();
      if (hasDuplicateAppointment(appointment.vehicleId, nextIso, appointment.id)) {
        window.alert("This update would create a duplicate appointment for the same vehicle at the same time.");
        return;
      }

      if (appointment.status !== APPOINTMENT_STATUS.PENDING_APPROVAL && appointment.status !== APPOINTMENT_STATUS.REJECTED && appointment.bay && isBayUnavailable(appointment.bay, nextIso, appointment.id)) {
        window.alert(`${appointment.bay} is unavailable for the updated time.`);
        return;
      }

      if (appointment.status !== APPOINTMENT_STATUS.PENDING_APPROVAL && appointment.status !== APPOINTMENT_STATUS.REJECTED && appointment.assignedOperator && isOperatorDoubleBooked(appointment.assignedOperator, nextIso, appointment.id)) {
        window.alert(`${appointment.assignedOperator} already has another appointment at the updated time. Reassign the operator or choose a different time.`);
        return;
      }

      const nextNote = window.prompt("Update booking note for this appointment.", appointment.bookingNote || "");
      if (nextNote === null) return;

      state.appointments = state.appointments.map((item) =>
        item.id === appointmentId
          ? {
              ...item,
              serviceType: nextServiceType.trim() || item.serviceType,
              appointmentAt: nextIso,
              bookingNote: nextNote.trim()
            }
          : item
      );

      state.workOrders = state.workOrders.map((workOrder) =>
        workOrder.appointmentId === appointmentId
          ? {
              ...workOrder,
              servicesPerformed: nextServiceType.trim() || workOrder.servicesPerformed
            }
          : workOrder
      );

      persistState();
      render();
    }

    function restockInventory(partId) {
      if (!isAdminUser()) return;
      const part = state.inventory.find((item) => item.id === partId);
      if (!part) return;

      const response = window.prompt(`Add quantity for ${part.name}. Current stock: ${part.quantity}`, "1");
      if (response === null) return;

      const quantityToAdd = Number(response);
      if (!Number.isFinite(quantityToAdd) || quantityToAdd <= 0) {
        window.alert("Enter a valid positive quantity to add.");
        return;
      }

      state.inventory = state.inventory.map((item) =>
        item.id === partId
          ? { ...item, quantity: item.quantity + quantityToAdd }
          : item
      );
      persistState();
      render();
    }

    function populateCustomerBookingVehicleOptions() {
      if (!elements.customerBookingVehicleSelect) return;
      const vehicles = getCurrentCustomerVehicles();
      elements.customerBookingVehicleSelect.innerHTML = vehicles.length
        ? vehicles.map((vehicle) => `<option value="${vehicle.id}">${getVehicleDisplayName(vehicle)}</option>`).join("")
        : '<option value="">Add a vehicle first</option>';
      elements.customerBookingVehicleSelect.disabled = vehicles.length === 0;
      updateCustomerBookingValidationState();
    }

    function populateCustomerBookingServiceOptions() {
      if (!elements.customerBookingServiceSelect) return;
      elements.customerBookingServiceSelect.innerHTML = SERVICE_CATALOG
        .map((service) => `<option value="${service.name}">${service.name}</option>`)
        .join("");
      updateCustomerBookingValidationState();
    }

    function validateCustomerVehicleForm({ interactive = true } = {}) {
      const year = Number(elements.customerVehicleYearField?.value);
      const make = elements.customerVehicleMakeField?.value.trim();
      const model = elements.customerVehicleModelField?.value.trim();
      const mileage = Number(elements.customerVehicleMileageField?.value);

      if (!elements.customerVehicleVin?.value.trim() || !make || !model || elements.customerVehicleYearField?.value.trim() === "" || elements.customerVehicleMileageField?.value.trim() === "") {
        if (interactive) {
          setFormMessage(elements.customerVehicleFormMessage, "Add all required vehicle details before saving.");
          window.alert("Please complete all required vehicle fields.");
        }
        return false;
      }

      if (!validateCustomerPortalVIN()) {
        if (interactive) {
          setFormMessage(elements.customerVehicleFormMessage, "Enter a valid VIN before saving.");
          window.alert("Enter a valid VIN before saving.");
        }
        return false;
      }

      if (!Number.isInteger(year) || year < 1900 || year > 2099) {
        if (interactive) {
          setFormMessage(elements.customerVehicleFormMessage, "Enter a valid model year.");
          window.alert("Enter a valid model year.");
        }
        return false;
      }

      if (!Number.isFinite(mileage) || mileage < 0) {
        elements.customerVehicleMileageField?.classList.add("is-invalid");
        if (interactive) {
          setFormMessage(elements.customerVehicleFormMessage, "Mileage must be a valid positive value.");
          window.alert("Mileage must be a valid positive value.");
        }
        return false;
      }

      elements.customerVehicleMileageField?.classList.remove("is-invalid");
      if (interactive) {
        clearFormMessage(elements.customerVehicleFormMessage);
      }
      return true;
    }

    function getMaintenanceChecklist(vehicle) {
      return SERVICE_CATALOG.map((service) => {
        if (!service.intervalMiles) {
          return { ...service, dueLabel: service.intervalLabel };
        }

        const currentMileage = Number(vehicle.mileage || 0);
        const remainder = currentMileage % service.intervalMiles;
        const milesUntilDue = remainder === 0 ? 0 : service.intervalMiles - remainder;
        return {
          ...service,
          dueLabel: milesUntilDue === 0 ? "Due now" : `${milesUntilDue.toLocaleString()} miles left`
        };
      });
    }

    function promptAssignmentValues(appointment) {
      const availableOperators = getOperatorNames();
      const operatorPrompt = `Assign operator for this appointment. Available: ${availableOperators.join(", ")}`;
      const nextOperator = window.prompt(operatorPrompt, appointment.assignedOperator || availableOperators[0] || "");
      if (nextOperator === null) return null;

      const trimmedOperator = nextOperator.trim();
      if (!trimmedOperator) {
        window.alert("Assignment canceled. An operator assignment is required.");
        return null;
      }

      const bayPrompt = `Assign bay for this appointment. Available bays: ${BAYS.join(", ")}`;
      const nextBay = window.prompt(bayPrompt, appointment.bay || BAYS[0]);
      if (nextBay === null) return null;

      const trimmedBay = nextBay.trim();
      if (!BAYS.includes(trimmedBay)) {
        window.alert(`Assignment canceled. Choose one of these bays: ${BAYS.join(", ")}.`);
        return null;
      }

      const durationResponse = window.prompt("Estimated duration in hours.", String(appointment.estimatedDurationHours || 1));
      if (durationResponse === null) return null;
      const estimatedDurationHours = Number(durationResponse);
      if (!Number.isFinite(estimatedDurationHours) || estimatedDurationHours <= 0) {
        window.alert("Enter a valid estimated duration in hours.");
        return null;
      }

      return {
        assignedOperator: trimmedOperator,
        bay: trimmedBay,
        estimatedDurationHours
      };
    }

    function applyAppointmentAssignment(appointmentId, assignmentValues) {
      const appointment = state.appointments.find((item) => item.id === appointmentId);
      if (!appointment) return false;

      if (hasDuplicateAppointment(appointment.vehicleId, appointment.appointmentAt, appointment.id)) {
        window.alert("This booking conflicts with an existing appointment for the same vehicle at the same time.");
        return false;
      }

      if (isBayUnavailable(assignmentValues.bay, appointment.appointmentAt, appointment.id)) {
        window.alert(`${assignmentValues.bay} is unavailable for that appointment time. Choose another bay.`);
        return false;
      }

      if (!isTechnicianAvailable(assignmentValues.assignedOperator, appointment.serviceType, appointment.id)) {
        return false;
      }

      state.appointments = state.appointments.map((item) =>
        item.id === appointmentId
          ? {
              ...item,
              approved: true,
              approvedByAdmin: auth.name,
              assignedOperator: assignmentValues.assignedOperator,
              bay: assignmentValues.bay,
              estimatedDurationHours: assignmentValues.estimatedDurationHours,
              status: item.status === APPOINTMENT_STATUS.PENDING_APPROVAL ? APPOINTMENT_STATUS.ASSIGNED : item.status
            }
          : item
      );

      const updatedAppointment = state.appointments.find((item) => item.id === appointmentId);
      const workOrder = createWorkOrderFromAppointment(updatedAppointment);
      if (workOrder) {
        state.workOrders = state.workOrders.map((item) =>
          item.id === workOrder.id
            ? { ...item, assignedTechnician: assignmentValues.assignedOperator }
            : item
        );
      }

      persistState();
      render();
      return true;
    }

    function approveAppointment(appointmentId) {
      if (auth?.role !== "admin") return;

      const appointment = state.appointments.find((item) => item.id === appointmentId);
      if (!appointment) return;
      const assignmentValues = promptAssignmentValues(appointment);
      if (!assignmentValues) return;
      applyAppointmentAssignment(appointmentId, assignmentValues);
    }

    function reassignAppointment(appointmentId) {
      if (!isAdminUser()) return;

      const appointment = state.appointments.find((item) => item.id === appointmentId);
      if (!appointment) return;

      const assignmentValues = promptAssignmentValues(appointment);
      if (!assignmentValues) return;
      applyAppointmentAssignment(appointmentId, assignmentValues);
    }

    function rejectAppointment(appointmentId) {
      if (!isAdminUser()) return;
      const appointment = state.appointments.find((item) => item.id === appointmentId);
      if (!appointment) return;

      const reason = window.prompt("Add a short rejection note for this appointment.", appointment.bookingNote || "");
      if (reason === null) return;

      state.appointments = state.appointments.map((item) =>
        item.id === appointmentId
          ? {
              ...item,
              approved: false,
              approvedByAdmin: auth.name,
              bookingNote: reason.trim(),
              status: APPOINTMENT_STATUS.REJECTED
            }
          : item
      );
      persistState();
      render();
    }

    function renderAppointmentQueue() {
      if (!isAdminUser() || !elements.appointmentQueueList) return;

      const appointments = [...state.appointments]
        .sort((first, second) => new Date(first.appointmentAt) - new Date(second.appointmentAt));

      elements.appointmentQueueList.innerHTML = renderList(
        appointments,
        (appointment) => {
          const customer = findCustomer(appointment.customerId);
          const vehicle = findVehicle(appointment.vehicleId);
          const workOrder = findWorkOrderByAppointment(appointment.id);
          const invoice = workOrder ? getInvoiceState(workOrder) : null;
          const appointmentCode = formatRecordId("APT", appointment.id);
          const workOrderCode = workOrder ? formatRecordId("WO", workOrder.id) : "WO-NOT-CREATED";
          const assignmentConflicts = getAssignmentConflictSummary(appointment);

          return `
            <article class="list-card">
              <h4>${appointment.serviceType}</h4>
              <p>${customer?.name || "Unknown customer"} · ${getVehicleDisplayName(vehicle)}</p>
              <div class="stack-meta">
                <span class="pill">${appointmentCode}</span>
                <span class="pill">${formatDate(appointment.appointmentAt)}</span>
                <span class="pill">${appointment.status}</span>
                <span class="pill">${workOrderCode}</span>
              </div>
              <div class="stack-meta">
                <span class="pill">${appointment.assignedOperator || "Operator not assigned"}</span>
                <span class="pill">${appointment.bay || "Bay not assigned"}</span>
                <span class="pill">${appointment.notificationSentAt ? "Customer notified" : "Notification pending"}</span>
                ${invoice ? `<span class="pill">${invoice.paid ? "Paid" : "Payment pending"}</span>` : ""}
              </div>
              <p>${appointment.bookingNote || "No booking note."}</p>
              ${assignmentConflicts.length ? `<p><strong>Scheduling issue:</strong> ${assignmentConflicts.join(" and ")}.</p>` : ""}
              <div class="list-actions">
                ${appointment.status === APPOINTMENT_STATUS.PENDING_APPROVAL ? `<button type="button" class="primary-btn" data-assign-appointment="${appointment.id}">Assign / Create Work Order</button>` : ""}
                ${appointment.status === APPOINTMENT_STATUS.PENDING_APPROVAL ? `<button type="button" class="danger-btn" data-reject-appointment="${appointment.id}">Reject</button>` : ""}
                ${appointment.status !== APPOINTMENT_STATUS.COMPLETED && appointment.status !== APPOINTMENT_STATUS.REJECTED ? `<button type="button" class="secondary-btn" data-reassign-appointment="${appointment.id}">Reassign Bay / Operator</button>` : ""}
                ${workOrder && workOrder.status === WORK_ORDER_STATUS.WORK_COMPLETED ? `<button type="button" class="secondary-btn" data-verify-work="${workOrder.id}">Review Work Order</button>` : ""}
                ${workOrder && workOrder.status === WORK_ORDER_STATUS.VERIFIED ? `<button type="button" class="primary-btn" data-ready-pickup="${workOrder.id}">Notify Ready for Pickup / Payment</button>` : ""}
                ${workOrder && [WORK_ORDER_STATUS.VERIFIED, WORK_ORDER_STATUS.READY_FOR_PICKUP].includes(workOrder.status) ? `<button type="button" class="secondary-btn" data-open-invoice="${workOrder.id}">${invoice?.paid ? "View Invoice" : "Open Invoice / Collect Payment"}</button>` : ""}
                ${workOrder && workOrder.status === WORK_ORDER_STATUS.READY_FOR_PICKUP && invoice?.paid ? `<button type="button" class="secondary-btn" data-complete-job="${workOrder.id}">Complete Pickup</button>` : ""}
              </div>
            </article>
          `;
        },
        "No appointments have been created yet."
      );

      elements.appointmentQueueList.querySelectorAll("[data-assign-appointment]").forEach((button) => {
        button.addEventListener("click", () => approveAppointment(button.dataset.assignAppointment));
      });
      elements.appointmentQueueList.querySelectorAll("[data-reassign-appointment]").forEach((button) => {
        button.addEventListener("click", () => reassignAppointment(button.dataset.reassignAppointment));
      });
      elements.appointmentQueueList.querySelectorAll("[data-reject-appointment]").forEach((button) => {
        button.addEventListener("click", () => rejectAppointment(button.dataset.rejectAppointment));
      });
      elements.appointmentQueueList.querySelectorAll("[data-verify-work]").forEach((button) => {
        button.addEventListener("click", () => adminAdvanceWorkOrder(button.dataset.verifyWork, WORK_ORDER_STATUS.VERIFIED));
      });
      elements.appointmentQueueList.querySelectorAll("[data-ready-pickup]").forEach((button) => {
        button.addEventListener("click", () => adminAdvanceWorkOrder(button.dataset.readyPickup, WORK_ORDER_STATUS.READY_FOR_PICKUP));
      });
      elements.appointmentQueueList.querySelectorAll("[data-open-invoice]").forEach((button) => {
        button.addEventListener("click", () => openInvoiceForWorkOrder(button.dataset.openInvoice));
      });
      elements.appointmentQueueList.querySelectorAll("[data-complete-job]").forEach((button) => {
        button.addEventListener("click", () => adminAdvanceWorkOrder(button.dataset.completeJob, WORK_ORDER_STATUS.COMPLETED));
      });
    }

    function renderOperatorJobs() {
      if (!isStaffUser() || !elements.operatorJobList) return;

      const jobs = state.workOrders
        .filter((workOrder) => {
          if (isOperatorUser()) {
            return workOrder.assignedTechnician === auth.name;
          }
          return true;
        })
        .filter((workOrder) => ![WORK_ORDER_STATUS.READY_FOR_PICKUP, WORK_ORDER_STATUS.COMPLETED].includes(workOrder.status))
        .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));

      elements.operatorJobList.innerHTML = renderList(
        jobs,
        (workOrder) => {
          const customer = findCustomer(workOrder.customerId);
          const vehicle = findVehicle(workOrder.vehicleId);
          const appointment = workOrder.appointmentId ? state.appointments.find((item) => item.id === workOrder.appointmentId) : null;
          return `
            <article class="list-card">
              <h4>${workOrder.servicesPerformed || "Service job"}</h4>
              <p>${customer?.name || "Unknown customer"} · ${getVehicleDisplayName(vehicle)}</p>
              <div class="stack-meta">
                <span class="pill">${formatRecordId("WO", workOrder.id)}</span>
                <span class="pill">${formatRecordId("APT", workOrder.appointmentId)}</span>
                <span class="pill">${workOrder.status}</span>
                <span class="pill">${workOrder.assignedTechnician || "Operator not assigned"}</span>
              </div>
              <div class="stack-meta">
                <span class="pill">${appointment?.bay || "Bay not assigned"}</span>
                <span class="pill">${appointment ? formatDate(appointment.appointmentAt) : "No linked appointment"}</span>
                <span class="pill">${appointment?.inventoryUsed || "No parts logged"}</span>
              </div>
              <p>${workOrder.faults || "No work notes recorded yet."}</p>
              <div class="list-actions">
                ${(isOperatorUser() || isAdminUser()) ? `<button type="button" class="secondary-btn" data-log-work="${workOrder.id}">Update Work Order</button>` : ""}
                ${isOperatorUser() && workOrder.status === WORK_ORDER_STATUS.ASSIGNED ? `<button type="button" class="secondary-btn" data-start-job="${workOrder.id}">Start Job</button>` : ""}
                ${isOperatorUser() && [WORK_ORDER_STATUS.IN_PROGRESS, WORK_ORDER_STATUS.WAITING_FOR_PARTS, WORK_ORDER_STATUS.WAITING_FOR_APPROVAL, WORK_ORDER_STATUS.ON_HOLD].includes(workOrder.status) ? `<button type="button" class="primary-btn" data-complete-work="${workOrder.id}">Mark Completed</button>` : ""}
              </div>
            </article>
          `;
        },
        isOperatorUser() ? "No jobs are assigned to this operator yet." : "No operator jobs are active right now."
      );

      elements.operatorJobList.querySelectorAll("[data-log-work]").forEach((button) => {
        button.addEventListener("click", () => logOperatorWorkUpdate(button.dataset.logWork));
      });
      elements.operatorJobList.querySelectorAll("[data-start-job]").forEach((button) => {
        button.addEventListener("click", () => updateWorkOrderStatus(button.dataset.startJob, WORK_ORDER_STATUS.IN_PROGRESS));
      });
      elements.operatorJobList.querySelectorAll("[data-complete-work]").forEach((button) => {
        button.addEventListener("click", () => updateWorkOrderStatus(button.dataset.completeWork, WORK_ORDER_STATUS.WORK_COMPLETED));
      });
    }

    function adminAdvanceWorkOrder(workOrderId, nextStatus) {
      if (!isAdminUser()) return;
      const workOrder = findWorkOrder(workOrderId);
      if (!workOrder) return;
      const linkedAppointment = workOrder.appointmentId ? state.appointments.find((item) => item.id === workOrder.appointmentId) : null;

      const allowedTransitions = {
        [WORK_ORDER_STATUS.WORK_COMPLETED]: [WORK_ORDER_STATUS.VERIFIED, WORK_ORDER_STATUS.IN_PROGRESS],
        [WORK_ORDER_STATUS.VERIFIED]: [WORK_ORDER_STATUS.READY_FOR_PICKUP],
        [WORK_ORDER_STATUS.READY_FOR_PICKUP]: [WORK_ORDER_STATUS.COMPLETED]
      };

      if (!(allowedTransitions[workOrder.status] || []).includes(nextStatus)) {
        window.alert(`Cannot move a work order from ${workOrder.status} to ${nextStatus}.`);
        return;
      }

      if (nextStatus === WORK_ORDER_STATUS.READY_FOR_PICKUP) {
        if (!linkedAppointment) {
          window.alert("A linked appointment is required before a job can be marked ready for pickup.");
          return;
        }

        if (!linkedAppointment.assignedOperator || !linkedAppointment.bay || linkedAppointment.status === APPOINTMENT_STATUS.PENDING_APPROVAL) {
          window.alert("This job must be assigned to an operator and bay before it can be marked ready for pickup.");
          return;
        }

        if (new Date(linkedAppointment.appointmentAt).getTime() > Date.now()) {
          window.alert("A future appointment cannot be marked ready for pickup.");
          return;
        }
      }

      if (nextStatus === WORK_ORDER_STATUS.COMPLETED) {
        const invoice = getInvoiceState(workOrder);
        if (!invoice.paid) {
          openInvoiceForWorkOrder(workOrder.id, "Payment is required before pickup can be completed. Review the invoice and mark it paid first.");
          window.alert("This work order has not been paid yet. Complete the invoice and mark it paid before completing pickup.");
          return;
        }
      }

      const timestamp = new Date().toISOString();
      state.workOrders = state.workOrders.map((item) =>
        item.id === workOrderId
          ? {
              ...item,
              status: nextStatus,
              verifiedAt: nextStatus === WORK_ORDER_STATUS.VERIFIED ? timestamp : item.verifiedAt,
              readyForPickupAt: nextStatus === WORK_ORDER_STATUS.READY_FOR_PICKUP ? timestamp : item.readyForPickupAt,
              completedAt: nextStatus === WORK_ORDER_STATUS.COMPLETED ? timestamp : item.completedAt
            }
          : item
      );

      syncAppointmentStatusFromWorkOrder(workOrder, nextStatus, timestamp);
      if (nextStatus === WORK_ORDER_STATUS.COMPLETED) {
        state.loyalty = state.loyalty.map((item) =>
          item.customerId === workOrder.customerId
            ? {
                ...item,
                points: item.points + 25,
                tier: item.points + 25 >= 250 ? "Fleet" : item.points + 25 >= 150 ? "Gold" : item.points + 25 >= 50 ? "Silver" : "None"
              }
            : item
        );
      }
      persistState();
      render();
    }

    function updateAppointmentServiceDetails(appointmentId) {
      const appointment = state.appointments.find((item) => item.id === appointmentId);
      if (!appointment) return;

      const nextFaults = window.prompt("Update observed faults for this appointment.", appointment.faults || "");
      if (nextFaults === null) return;

      const nextNote = window.prompt("Update service note for this appointment.", appointment.bookingNote || "");
      if (nextNote === null) return;

      state.appointments = state.appointments.map((item) =>
        item.id === appointmentId
          ? {
              ...item,
              faults: nextFaults.trim(),
              bookingNote: nextNote.trim()
            }
          : item
      );

      const workOrder = findWorkOrderByAppointment(appointmentId);
      if (workOrder) {
        state.workOrders = state.workOrders.map((item) =>
          item.id === workOrder.id
            ? { ...item, faults: nextFaults.trim() }
            : item
        );
      }

      persistState();
      render();
    }

    function cancelCustomerAppointment(appointmentId) {
      const customer = getCurrentCustomer();
      const appointment = state.appointments.find((item) => item.id === appointmentId);
      if (!customer || !appointment || appointment.customerId !== customer.id) return;
      if (new Date(appointment.appointmentAt).getTime() <= Date.now()) {
        window.alert("Past appointments cannot be canceled.");
        return;
      }

      const workOrder = findWorkOrderByAppointment(appointmentId);
      if (workOrder && [WORK_ORDER_STATUS.WORK_COMPLETED, WORK_ORDER_STATUS.VERIFIED, WORK_ORDER_STATUS.READY_FOR_PICKUP, WORK_ORDER_STATUS.COMPLETED].includes(workOrder.status)) {
        window.alert("This appointment can no longer be canceled online. Please contact the shop.");
        return;
      }

      const confirmed = window.confirm("Cancel this appointment?");
      if (!confirmed) return;

      state.appointments = state.appointments.filter((item) => item.id !== appointmentId);
      if (workOrder) {
        state.workOrders = state.workOrders.filter((item) => item.id !== workOrder.id);
        state.workOrderParts = state.workOrderParts.filter((item) => item.workOrderId !== workOrder.id);
      }
      persistState();
      render();
    }

    function getAllUsers() {
      return state.users || [];
    }

    function upsertOperatorUser(operatorRecord) {
      const existingUser = state.users.find((user) => user.id === operatorRecord.id && user.role === "operator");
      const nextUser = {
        id: existingUser?.id || operatorRecord.id || `operator-${crypto.randomUUID()}`,
        role: "operator",
        email: operatorRecord.email.toLowerCase(),
        passwordHash: existingUser?.passwordHash || DEMO_PASSWORD_HASHES.operator,
        name: operatorRecord.name
      };
      state.users = existingUser
        ? state.users.map((user) => user.id === existingUser.id ? nextUser : user)
        : [...state.users, nextUser];
    }

    function upsertCustomerUser(customer) {
      const existingUser = state.users.find((user) => user.customerId === customer.id && user.role === "customer");
      const nextUser = {
        id: existingUser?.id || `customer-${customer.id}`,
        role: "customer",
        email: customer.email.toLowerCase(),
        passwordHash: existingUser?.passwordHash || DEFAULT_CUSTOMER_PASSWORD_HASH,
        name: customer.name,
        customerId: customer.id
      };
      state.users = existingUser
        ? state.users.map((user) => user.id === existingUser.id ? nextUser : user)
        : [...state.users, nextUser];
    }

    function resetOperatorPassword(operatorId) {
      const operator = getOperatorUsers().find((user) => user.id === operatorId);
      if (!operator) return;
      const resetPassword = DEFAULT_OPERATOR_PASSWORD;

      const existingOperatorUser = state.users.find((user) => user.id === operatorId && user.role === "operator");
      if (existingOperatorUser) {
        state.users = state.users.map((user) =>
          user.id === operatorId && user.role === "operator"
            ? { ...user, passwordHash: hashPassword(resetPassword) }
            : user
        );
      } else {
        state.users.push({
          id: operatorId,
          role: "operator",
          name: operator.name,
          email: operator.email,
          passwordHash: hashPassword(resetPassword)
        });
      }
      persistState();
      render();
      setFormMessage(elements.operatorFormMessage, `Password reset successful for ${operator.name}. Default password restored: ${DEFAULT_OPERATOR_PASSWORD}`);
      window.alert(`Password reset successful for ${operator.name}. Default password restored: ${DEFAULT_OPERATOR_PASSWORD}`);
    }

    function resetCustomerPassword(customerId) {
      const customer = findCustomer(customerId);
      if (!customer) return;
      const resetPassword = DEFAULT_CUSTOMER_PASSWORD;

      const existingCustomerUser = state.users.find((user) => user.customerId === customerId && user.role === "customer");
      if (existingCustomerUser) {
        state.users = state.users.map((user) =>
          user.customerId === customerId && user.role === "customer"
            ? { ...user, passwordHash: hashPassword(resetPassword) }
            : user
        );
      } else {
        state.users.push({
          id: `customer-${customerId}`,
          role: "customer",
          name: customer.name,
          email: customer.email.toLowerCase(),
          customerId,
          passwordHash: hashPassword(resetPassword)
        });
      }
      persistState();
      render();
      setFormMessage(elements.customerFormMessage, `Password reset successful for ${customer.name}. Default password restored: ${DEFAULT_CUSTOMER_PASSWORD}`);
      window.alert(`Password reset successful for ${customer.name}. Default password restored: ${DEFAULT_CUSTOMER_PASSWORD}`);
    }

    function changeCustomerPassword() {
      const customer = getCurrentCustomer();
      if (!customer) return false;

      const newPassword = String(elements.customerNewPassword?.value || "").trim();
      if (!validateCustomerPasswordFields({ interactive: true })) {
        const message = elements.customerPasswordMessage?.textContent || "Password update failed.";
        window.alert(message);
        return false;
      }

      state.users = state.users.map((user) =>
        user.customerId === customer.id && user.role === "customer"
          ? { ...user, passwordHash: hashPassword(newPassword) }
          : user
      );
      persistState();
      setFormMessage(elements.customerPasswordMessage, "Password updated successfully.");
      return true;
    }

    function findUserByCredentials(email, password, role) {
      const passwordHash = hashPassword(password);
      return getAllUsers().find((user) => user.email === email && user.passwordHash === passwordHash && user.role === role);
    }

    function confirmAdminPassword(actionLabel) {
      if (!isAdminUser()) {
        window.alert("Only admin can confirm this action.");
        return false;
      }

      const password = window.prompt(`Enter the admin password to confirm: ${actionLabel}`);
      if (password === null) return false;

      const adminUser = getAllUsers().find((user) => user.role === "admin" && user.email === auth?.email);
      if (!adminUser || adminUser.passwordHash !== hashPassword(password)) {
        window.alert("Password confirmation failed. The action was canceled.");
        return false;
      }

      return true;
    }

    function deleteCustomer(customerId) {
      if (!isAdminUser()) return;

      const customer = findCustomer(customerId);
      if (!customer) return;

      const customerVehicles = state.vehicles.filter((vehicle) => vehicle.customerId === customerId);
      const vehicleIds = new Set(customerVehicles.map((vehicle) => vehicle.id));
      const workOrderIds = new Set(
        state.workOrders
          .filter((order) => order.customerId === customerId || vehicleIds.has(order.vehicleId))
          .map((order) => order.id)
      );
      const confirmed = window.confirm(`Delete ${customer.name}? This will also remove ${customerVehicles.length} vehicle(s), linked appointments, and work orders.`);
      if (!confirmed) return;
      if (!confirmAdminPassword(`delete customer ${customer.name}`)) return;

      state.customers = state.customers.filter((item) => item.id !== customerId);
      state.users = state.users.filter((user) => user.customerId !== customerId);
      state.loyalty = state.loyalty.filter((item) => item.customerId !== customerId);
      state.vehicles = state.vehicles.filter((vehicle) => vehicle.customerId !== customerId);
      state.workOrders = state.workOrders.filter((order) => order.customerId !== customerId && !vehicleIds.has(order.vehicleId));
      state.workOrderParts = state.workOrderParts.filter((item) => !workOrderIds.has(item.workOrderId));
      state.appointments = state.appointments.filter((appointment) => appointment.customerId !== customerId && !vehicleIds.has(appointment.vehicleId));

      if (auth?.customerId === customerId) {
        auth = null;
        localStorage.removeItem(AUTH_KEY);
      }

      persistState();
      render();
    }

    function deleteOperator(operatorId) {
      if (!isAdminUser()) return;

      const operator = getOperatorUsers().find((user) => user.id === operatorId);
      if (!operator) return;

      if (auth?.email === operator.email) {
        window.alert("You cannot delete the operator account that is currently signed in.");
        return;
      }

      const confirmed = window.confirm(`Delete operator ${operator.name}? Existing appointment and work-order history will keep the recorded operator name.`);
      if (!confirmed) return;
      if (!confirmAdminPassword(`delete operator ${operator.name}`)) return;

      state.users = state.users.filter((user) => !(user.id === operatorId && user.role === "operator"));
      persistState();
      render();
    }

    function deleteVehicle(vehicleId) {
      if (!isAdminUser()) return;

      const vehicle = findVehicle(vehicleId);
      if (!vehicle) return;
      const workOrderIds = new Set(
        state.workOrders
          .filter((order) => order.vehicleId === vehicleId)
          .map((order) => order.id)
      );
      const confirmed = window.confirm(`Delete ${getVehicleDisplayName(vehicle)}? Linked appointments and work orders for this vehicle will also be removed.`);
      if (!confirmed) return;
      if (!confirmAdminPassword(`delete vehicle ${getVehicleDisplayName(vehicle)}`)) return;

      state.vehicles = state.vehicles.filter((item) => item.id !== vehicleId);
      state.workOrders = state.workOrders.filter((order) => order.vehicleId !== vehicleId);
      state.workOrderParts = state.workOrderParts.filter((item) => !workOrderIds.has(item.workOrderId));
      state.appointments = state.appointments.filter((appointment) => appointment.vehicleId !== vehicleId);
      persistState();
      render();
    }

    function populateCustomerSelect() {
      const selectedValue = elements.vehicleCustomerSelect.value;
      const options = state.customers
        .map((customer) => `<option value="${customer.id}">${customer.name}</option>`)
        .join("");

      elements.vehicleCustomerSelect.innerHTML = options || '<option value="">Add a customer first</option>';
      elements.vehicleCustomerSelect.disabled = state.customers.length === 0;
      if (selectedValue && state.customers.some((customer) => customer.id === selectedValue)) {
        elements.vehicleCustomerSelect.value = selectedValue;
      }
    }

    function populateWorkOrderSelects() {
      if (!elements.workOrderCustomerSelect) return;

      const currentAppointmentId = elements.workOrderAppointmentSelect?.value || "";
      const currentCustomer = elements.workOrderCustomerSelect.value;
      const availableAppointments = state.appointments
        .filter((appointment) => appointment.status === APPOINTMENT_STATUS.ASSIGNED)
        .filter((appointment) => {
          const linkedWorkOrder = findWorkOrderByAppointment(appointment.id);
          return !linkedWorkOrder || linkedWorkOrder.appointmentId === currentAppointmentId;
        })
        .sort((first, second) => new Date(first.appointmentAt) - new Date(second.appointmentAt));

      if (elements.workOrderAppointmentSelect) {
        elements.workOrderAppointmentSelect.innerHTML = availableAppointments.length
          ? availableAppointments.map((appointment) => {
              const customer = findCustomer(appointment.customerId);
              const vehicle = findVehicle(appointment.vehicleId);
              return `<option value="${appointment.id}">${formatDate(appointment.appointmentAt)} · ${customer?.name || "Unknown customer"} · ${getVehicleDisplayName(vehicle)}</option>`;
            }).join("")
          : '<option value="">Dispatch an appointment first</option>';
        elements.workOrderAppointmentSelect.disabled = availableAppointments.length === 0;

        if (currentAppointmentId && availableAppointments.some((appointment) => appointment.id === currentAppointmentId)) {
          elements.workOrderAppointmentSelect.value = currentAppointmentId;
        }
      }

      const selectedAppointment = elements.workOrderAppointmentSelect?.value
        ? state.appointments.find((appointment) => appointment.id === elements.workOrderAppointmentSelect.value)
        : null;

      elements.workOrderCustomerSelect.innerHTML = state.customers.length
        ? state.customers.map((customer) => `<option value="${customer.id}">${customer.name}</option>`).join("")
        : '<option value="">Add a customer first</option>';
      elements.workOrderCustomerSelect.disabled = state.customers.length === 0;

      if (selectedAppointment) {
        elements.workOrderCustomerSelect.value = selectedAppointment.customerId;
      } else if (currentCustomer && state.customers.some((customer) => customer.id === currentCustomer)) {
        elements.workOrderCustomerSelect.value = currentCustomer;
      }

      const selectedCustomerId = elements.workOrderCustomerSelect.value;
      const vehicles = state.vehicles.filter((vehicle) => vehicle.customerId === selectedCustomerId);
      elements.workOrderVehicleSelect.innerHTML = vehicles.length
        ? vehicles.map((vehicle) => `<option value="${vehicle.id}">${getVehicleDisplayName(vehicle)}</option>`).join("")
        : '<option value="">Add a vehicle first</option>';
      elements.workOrderVehicleSelect.disabled = vehicles.length === 0;

      if (selectedAppointment && vehicles.some((vehicle) => vehicle.id === selectedAppointment.vehicleId)) {
        elements.workOrderVehicleSelect.value = selectedAppointment.vehicleId;
      }

      elements.workOrderServiceSelect.innerHTML = SERVICE_CATALOG
        .map((service) => `<option value="${service.name}">${service.name}</option>`)
        .join("");
      if (selectedAppointment?.serviceType) {
        elements.workOrderServiceSelect.value = selectedAppointment.serviceType;
      }

      const operatorNames = getOperatorNames();
      elements.workOrderTechnicianSelect.innerHTML = operatorNames
        .map((operator) => `<option value="${operator}">${operator}</option>`)
        .join("");
      if (selectedAppointment?.assignedOperator && operatorNames.includes(selectedAppointment.assignedOperator)) {
        elements.workOrderTechnicianSelect.value = selectedAppointment.assignedOperator;
      }
    }

    // =============================
    // ADMIN / OPERATOR WORKFLOW VIEWS
    // =============================
    function renderWorkOrders() {
      if (!elements.workOrderList) return;

      elements.workOrderList.innerHTML = renderList(
        [...state.workOrders].sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt)),
        (workOrder) => {
          const customer = findCustomer(workOrder.customerId);
          const vehicle = findVehicle(workOrder.vehicleId);
          return `
            <article class="list-card">
              <h4>${workOrder.servicesPerformed || "Service"}</h4>
              <p>${customer?.name || "Unknown customer"} · ${getVehicleDisplayName(vehicle)}</p>
              <div class="stack-meta">
                <span class="pill">${workOrder.status}</span>
                <span class="pill">${workOrder.assignedTechnician || "Technician not assigned"}</span>
              </div>
              <p>${workOrder.faults || "No faults or notes logged yet."}</p>
            </article>
          `;
        },
        "No work orders yet. Create one to start the service flow."
      );
    }

    function editLinkedWorkOrder(workOrderId) {
      const workOrder = findWorkOrder(workOrderId);
      if (!workOrder) return;

      const nextService = window.prompt("Update services performed for this work order.", workOrder.servicesPerformed || "");
      if (nextService === null) return;

      const nextFaults = window.prompt("Update faults and service notes.", workOrder.faults || "");
      if (nextFaults === null) return;

      state.workOrders = state.workOrders.map((item) =>
        item.id === workOrderId
          ? {
              ...item,
              servicesPerformed: nextService.trim() || item.servicesPerformed,
              faults: nextFaults.trim()
            }
          : item
      );

      if (workOrder.appointmentId) {
        state.appointments = state.appointments.map((appointment) =>
          appointment.id === workOrder.appointmentId
            ? {
                ...appointment,
                serviceType: nextService.trim() || appointment.serviceType,
                faults: nextFaults.trim()
              }
            : appointment
        );
      }

      persistState();
      render();
    }

    function renderInventory() {
      if (!elements.inventoryList) return;

      elements.inventoryList.innerHTML = renderList(
        [...state.inventory].sort((first, second) => first.name.localeCompare(second.name)),
        (part) => `
          <article class="list-card">
            <h4>${part.name}</h4>
            <p>SKU ${part.sku}</p>
            <div class="stack-meta">
              <span class="pill">${part.quantity} in stock</span>
              <span class="pill">Reorder at ${part.reorderPoint}</span>
              <span class="pill">$${Number(part.price || 0).toFixed(2)}</span>
            </div>
            <div class="list-actions">
              <button type="button" class="secondary-btn" data-edit-part="${part.id}">Edit Part</button>
            </div>
          </article>
        `,
        "No parts have been added yet."
      );

      elements.inventoryList.querySelectorAll("[data-edit-part]").forEach((button) => {
        button.addEventListener("click", () => startInventoryEdit(button.dataset.editPart));
      });
    }

    // =============================
    // LIST / DASHBOARD RENDERING
    // =============================
    function renderList(items, renderItem, emptyMessage) {
      if (!items.length) {
        return `<div class="empty-state">${emptyMessage}</div>`;
      }
      return items.map(renderItem).join("");
    }

    function renderMetrics() {
      const openStatuses = [
        WORK_ORDER_STATUS.ASSIGNED,
        WORK_ORDER_STATUS.IN_PROGRESS,
        WORK_ORDER_STATUS.WAITING_FOR_PARTS,
        WORK_ORDER_STATUS.WAITING_FOR_APPROVAL,
        WORK_ORDER_STATUS.ON_HOLD,
        WORK_ORDER_STATUS.WORK_COMPLETED,
        WORK_ORDER_STATUS.VERIFIED,
        WORK_ORDER_STATUS.READY_FOR_PICKUP
      ];
      elements.metricCustomers.textContent = state.customers.length;
      elements.metricVehicles.textContent = state.vehicles.length;
      elements.metricOpenOrders.textContent = state.workOrders.filter((workOrder) => openStatuses.includes(workOrder.status)).length;
      elements.metricLowStock.textContent = state.inventory.filter((part) => part.quantity <= part.reorderPoint).length;
    }

    function renderCustomers() {
      if (!isAdminUser()) {
        elements.customerList.innerHTML = "";
        return;
      }

      elements.customerList.innerHTML = renderList(
        state.customers,
        (customer) => {
          const vehiclesOwned = state.vehicles.filter((vehicle) => vehicle.customerId === customer.id).length;
          const loyalty = getLoyaltyRecord(customer.id);
          return `
            <article class="list-card">
              <h4>${customer.name}</h4>
              <p>${customer.email}</p>
              <div class="stack-meta">
                <span class="pill">${customer.address || "No address on file"}</span>
                <span class="pill">${customer.phone}</span>
                <span class="pill">Tier: ${loyalty.tier}</span>
                <span class="pill">${loyalty.points} pts</span>
                <span class="pill">${vehiclesOwned} vehicle(s)</span>
              </div>
              <div class="list-actions">
                <button type="button" class="secondary-btn" data-edit-customer="${customer.id}">Edit Customer</button>
                <button type="button" class="secondary-btn" data-reset-password="${customer.id}">Reset Password</button>
                <button type="button" class="danger-btn" data-delete-customer="${customer.id}">Delete Customer</button>
              </div>
            </article>
          `;
        },
        "No customers yet. Start by creating your first shop customer profile."
      );

      elements.customerList.querySelectorAll("[data-edit-customer]").forEach((button) => {
        button.addEventListener("click", () => startCustomerEdit(button.dataset.editCustomer));
      });
      elements.customerList.querySelectorAll("[data-reset-password]").forEach((button) => {
        button.addEventListener("click", () => resetCustomerPassword(button.dataset.resetPassword));
      });
      elements.customerList.querySelectorAll("[data-delete-customer]").forEach((button) => {
        button.addEventListener("click", () => deleteCustomer(button.dataset.deleteCustomer));
      });
    }

    function renderOperators() {
      if (!elements.operatorList) return;
      if (!isAdminUser()) {
        elements.operatorList.innerHTML = "";
        return;
      }

      const operators = getOperatorUsers();
      elements.operatorList.innerHTML = renderList(
        operators,
        (operator) => {
          const profile = getTechnicianProfile(operator.name);
          return `
            <article class="list-card">
              <h4>${operator.name}</h4>
              <p>${operator.email}</p>
              <div class="stack-meta">
                <span class="pill">Default login: ${operator.email}</span>
                <span class="pill">Password: ${DEFAULT_OPERATOR_PASSWORD}</span>
                <span class="pill">Capacity: ${profile?.maxConcurrentJobs || 2}</span>
              </div>
              <div class="list-actions">
                <button type="button" class="secondary-btn" data-edit-operator="${operator.id}">Edit Operator</button>
                <button type="button" class="secondary-btn" data-reset-operator-password="${operator.id}">Reset Password</button>
                <button type="button" class="danger-btn" data-delete-operator="${operator.id}">Delete Operator</button>
              </div>
            </article>
          `;
        },
        "No operators yet. Add an operator account for service assignments."
      );

      elements.operatorList.querySelectorAll("[data-edit-operator]").forEach((button) => {
        button.addEventListener("click", () => startOperatorEdit(button.dataset.editOperator));
      });
      elements.operatorList.querySelectorAll("[data-reset-operator-password]").forEach((button) => {
        button.addEventListener("click", () => resetOperatorPassword(button.dataset.resetOperatorPassword));
      });
      elements.operatorList.querySelectorAll("[data-delete-operator]").forEach((button) => {
        button.addEventListener("click", () => deleteOperator(button.dataset.deleteOperator));
      });
    }

    function renderVehicles() {
      elements.vehicleList.innerHTML = renderList(
        state.vehicles,
        (vehicle) => {
          const customer = findCustomer(vehicle.customerId);
          const operatorActions = isOperatorUser()
            ? `
              <div class="list-actions">
                <button type="button" class="secondary-btn" data-operator-update-vehicle="${vehicle.id}">Update Mileage / Codes</button>
              </div>
            `
            : `
              <div class="list-actions">
                <button type="button" class="secondary-btn" data-edit-vehicle="${vehicle.id}">Edit Vehicle</button>
                <button type="button" class="danger-btn" data-delete-vehicle="${vehicle.id}">Delete Vehicle</button>
              </div>
            `;
          return `
            <article class="list-card">
              <h4>${getVehicleDisplayName(vehicle)}</h4>
              <p>${customer?.name || "Unknown customer"} · VIN ${vehicle.vin}</p>
              <div class="stack-meta">
                <span class="pill">${vehicle.year || "Year n/a"}</span>
                <span class="pill">${vehicle.make || "Make n/a"}</span>
                <span class="pill">${vehicle.model || "Model n/a"}</span>
                <span class="pill">${Number(vehicle.mileage).toLocaleString()} miles</span>
                <span class="pill">${vehicle.warranty || "No warranty notes"}</span>
                <span class="pill">${vehicle.codes || "No active codes"}</span>
              </div>
              ${operatorActions}
            </article>
          `;
        },
        "No vehicles yet. Link a vehicle to a customer to build service history."
      );

      if (isAdminUser()) {
        elements.vehicleList.querySelectorAll("[data-edit-vehicle]").forEach((button) => {
          button.addEventListener("click", () => startVehicleEdit(button.dataset.editVehicle));
        });
        elements.vehicleList.querySelectorAll("[data-delete-vehicle]").forEach((button) => {
          button.addEventListener("click", () => deleteVehicle(button.dataset.deleteVehicle));
        });
      }

      if (isOperatorUser()) {
        elements.vehicleList.querySelectorAll("[data-operator-update-vehicle]").forEach((button) => {
          button.addEventListener("click", () => updateOperatorVehicle(button.dataset.operatorUpdateVehicle));
        });
      }
    }

    function renderSchedule() {
      if (!isStaffUser()) return;

      const appointments = [...state.appointments]
        .filter((appointment) => isServiceUser()
          ? appointment.status !== APPOINTMENT_STATUS.PENDING_APPROVAL && appointment.status !== APPOINTMENT_STATUS.REJECTED
          : true)
        .sort((first, second) => new Date(first.appointmentAt) - new Date(second.appointmentAt));
      const ongoingWorkOrders = state.workOrders
        .filter((workOrder) => [WORK_ORDER_STATUS.ASSIGNED, WORK_ORDER_STATUS.IN_PROGRESS, WORK_ORDER_STATUS.WAITING_FOR_PARTS, WORK_ORDER_STATUS.WAITING_FOR_APPROVAL, WORK_ORDER_STATUS.ON_HOLD].includes(workOrder.status))
        .sort((first, second) => new Date(first.createdAt) - new Date(second.createdAt));

      elements.ongoingServicesList.innerHTML = renderList(
        ongoingWorkOrders,
        (workOrder) => {
          const customer = findCustomer(workOrder.customerId);
          const vehicle = findVehicle(workOrder.vehicleId);
          return `
            <article class="list-card">
              <h4>${workOrder.status}</h4>
              <p>${customer?.name || "Unknown customer"} · ${getVehicleDisplayName(vehicle)}</p>
              <div class="stack-meta">
                <span class="pill">${workOrder.servicesPerformed || "Service not set"}</span>
                <span class="pill">${workOrder.assignedTechnician || "Technician not assigned"}</span>
              </div>
              <p>${workOrder.faults || "No faults or service notes logged yet."}</p>
              <div class="list-actions">
                ${isServiceUser() ? `<button type="button" class="secondary-btn" data-ongoing-edit-work-order="${workOrder.id}">Edit Work Order</button>` : ""}
                ${isServiceUser() && workOrder.status === WORK_ORDER_STATUS.ASSIGNED ? `<button type="button" class="secondary-btn" data-ongoing-in-progress="${workOrder.id}">Start Work</button>` : ""}
                ${isServiceUser() && workOrder.status === WORK_ORDER_STATUS.IN_PROGRESS ? `<button type="button" class="secondary-btn" data-ongoing-waiting-parts="${workOrder.id}">Awaiting Parts</button>` : ""}
                ${isServiceUser() && [WORK_ORDER_STATUS.ASSIGNED, WORK_ORDER_STATUS.IN_PROGRESS, WORK_ORDER_STATUS.WAITING_FOR_PARTS, WORK_ORDER_STATUS.WAITING_FOR_APPROVAL].includes(workOrder.status) ? `<button type="button" class="secondary-btn" data-ongoing-suspended="${workOrder.id}">Suspended</button>` : ""}
                ${isServiceUser() && [WORK_ORDER_STATUS.WAITING_FOR_PARTS, WORK_ORDER_STATUS.WAITING_FOR_APPROVAL, WORK_ORDER_STATUS.ON_HOLD].includes(workOrder.status) ? `<button type="button" class="secondary-btn" data-ongoing-resume="${workOrder.id}">Resume Work</button>` : ""}
                ${isServiceUser() && workOrder.status === WORK_ORDER_STATUS.IN_PROGRESS ? `<button type="button" class="primary-btn" data-ongoing-completed="${workOrder.id}">Completed Service</button>` : ""}
              </div>
            </article>
          `;
        },
        "No ongoing services right now."
      );

      elements.ongoingServicesList.querySelectorAll("[data-ongoing-edit-work-order]").forEach((button) => {
        button.addEventListener("click", () => editLinkedWorkOrder(button.dataset.ongoingEditWorkOrder));
      });
      elements.ongoingServicesList.querySelectorAll("[data-ongoing-in-progress]").forEach((button) => {
        button.addEventListener("click", () => updateWorkOrderStatus(button.dataset.ongoingInProgress, WORK_ORDER_STATUS.IN_PROGRESS));
      });
      elements.ongoingServicesList.querySelectorAll("[data-ongoing-waiting-parts]").forEach((button) => {
        button.addEventListener("click", () => updateWorkOrderStatus(button.dataset.ongoingWaitingParts, WORK_ORDER_STATUS.WAITING_FOR_PARTS));
      });
      elements.ongoingServicesList.querySelectorAll("[data-ongoing-suspended]").forEach((button) => {
        button.addEventListener("click", () => updateWorkOrderStatus(button.dataset.ongoingSuspended, WORK_ORDER_STATUS.ON_HOLD));
      });
      elements.ongoingServicesList.querySelectorAll("[data-ongoing-resume]").forEach((button) => {
        button.addEventListener("click", () => updateWorkOrderStatus(button.dataset.ongoingResume, WORK_ORDER_STATUS.IN_PROGRESS));
      });
      elements.ongoingServicesList.querySelectorAll("[data-ongoing-completed]").forEach((button) => {
        button.addEventListener("click", () => updateWorkOrderStatus(button.dataset.ongoingCompleted, WORK_ORDER_STATUS.WORK_COMPLETED));
      });

      elements.scheduleList.innerHTML = renderList(
        appointments,
        (appointment) => {
          const customer = findCustomer(appointment.customerId);
          const vehicle = findVehicle(appointment.vehicleId);
          const workOrder = findWorkOrderByAppointment(appointment.id);
          const invoice = workOrder ? getInvoiceState(workOrder) : null;
          const availableParts = state.inventory.filter((part) => part.quantity > 0);
          return `
            <article class="list-card">
              <h4>${appointment.serviceType}</h4>
              <p>${customer?.name || "Unknown customer"} · ${getVehicleDisplayName(vehicle)}</p>
              <div class="stack-meta">
                <span class="pill">${formatDate(appointment.appointmentAt)}</span>
                <span class="pill">${appointment.status || APPOINTMENT_STATUS.PENDING_APPROVAL}</span>
                <span class="pill">${appointment.approved ? `Approved by ${appointment.approvedByAdmin || "Admin"}` : "Pending admin approval"}</span>
                <span class="pill">${appointment.assignedOperator || "Operator not assigned"}</span>
                <span class="pill">${appointment.bay || "Bay not assigned"}</span>
                <span class="pill">${appointment.estimatedDurationHours || 1} hr est.</span>
                <span class="pill">${workOrder?.status || "No work order yet"}</span>
              </div>
              <p>${appointment.bookingNote || "No booking note."}</p>
              <div class="stack-meta">
                <span class="pill">Faults: ${workOrder?.faults || appointment.faults || "None logged"}</span>
                <span class="pill">Inventory: ${appointment.inventoryUsed || "None logged"}</span>
                ${invoice ? `<span class="pill">${invoice.paid ? "Paid" : "Payment pending"}</span>` : ""}
              </div>
              ${workOrder && isServiceUser() ? `
                <div class="form-grid">
                  <label>
                    Used Item
                    <select data-part-select="${workOrder.id}">
                      ${availableParts.length
                        ? availableParts.map((part) => `<option value="${part.id}">${part.name} (${part.quantity} in stock)</option>`).join("")
                        : '<option value="">No stocked parts available</option>'}
                    </select>
                  </label>
                  <label>
                    Quantity
                    <input type="number" min="1" value="1" data-part-quantity="${workOrder.id}">
                  </label>
                </div>
              ` : ""}
              <div class="list-actions">
                ${!appointment.approved && auth?.role === "admin" ? `<button type="button" class="primary-btn" data-approve-appointment="${appointment.id}">Approve Appointment</button>` : ""}
                ${!appointment.approved && auth?.role === "admin" ? `<button type="button" class="danger-btn" data-reject-appointment="${appointment.id}">Reject Appointment</button>` : ""}
                ${appointment.status !== APPOINTMENT_STATUS.COMPLETED && appointment.status !== APPOINTMENT_STATUS.REJECTED ? `<button type="button" class="secondary-btn" data-edit-appointment="${appointment.id}">Edit Appointment</button>` : ""}
                ${workOrder && isServiceUser() ? `<button type="button" class="secondary-btn" data-edit-work-order="${workOrder.id}">Edit Work Order</button>` : ""}
                ${(auth?.role === "admin" || isServiceUser()) ? `<button type="button" class="secondary-btn" data-update-appointment="${appointment.id}">Update Faults / Notes</button>` : ""}
                ${workOrder && isServiceUser() ? `<button type="button" class="secondary-btn" data-add-inventory="${workOrder.id}">Add Used Item</button>` : ""}
                ${workOrder && isServiceUser() && workOrder.status === WORK_ORDER_STATUS.ASSIGNED ? `<button type="button" class="secondary-btn" data-status-in-progress="${workOrder.id}">Start Work</button>` : ""}
                ${workOrder && isServiceUser() && workOrder.status === WORK_ORDER_STATUS.IN_PROGRESS ? `<button type="button" class="secondary-btn" data-status-waiting-parts="${workOrder.id}">Waiting for Parts</button>` : ""}
                ${workOrder && isServiceUser() && workOrder.status === WORK_ORDER_STATUS.IN_PROGRESS ? `<button type="button" class="secondary-btn" data-status-waiting-approval="${workOrder.id}">Waiting for Approval</button>` : ""}
                ${workOrder && isServiceUser() && [WORK_ORDER_STATUS.IN_PROGRESS, WORK_ORDER_STATUS.WAITING_FOR_PARTS, WORK_ORDER_STATUS.WAITING_FOR_APPROVAL].includes(workOrder.status) ? `<button type="button" class="secondary-btn" data-status-on-hold="${workOrder.id}">On Hold</button>` : ""}
                ${workOrder && isServiceUser() && [WORK_ORDER_STATUS.WAITING_FOR_PARTS, WORK_ORDER_STATUS.WAITING_FOR_APPROVAL, WORK_ORDER_STATUS.ON_HOLD].includes(workOrder.status) ? `<button type="button" class="secondary-btn" data-status-resume="${workOrder.id}">Resume Work</button>` : ""}
                ${workOrder && isServiceUser() && workOrder.status === WORK_ORDER_STATUS.IN_PROGRESS ? `<button type="button" class="primary-btn" data-status-work-completed="${workOrder.id}">Work Completed</button>` : ""}
                ${workOrder && auth?.role === "admin" && workOrder.status === WORK_ORDER_STATUS.WORK_COMPLETED ? `<button type="button" class="secondary-btn" data-send-back="${workOrder.id}">Send Back</button>` : ""}
                ${workOrder && auth?.role === "admin" && workOrder.status === WORK_ORDER_STATUS.WORK_COMPLETED ? `<button type="button" class="secondary-btn" data-status-verified="${workOrder.id}">Verify</button>` : ""}
                ${workOrder && auth?.role === "admin" && workOrder.status === WORK_ORDER_STATUS.VERIFIED ? `<button type="button" class="secondary-btn" data-status-ready="${workOrder.id}">Ready for Pickup</button>` : ""}
                ${workOrder && auth?.role === "admin" && [WORK_ORDER_STATUS.VERIFIED, WORK_ORDER_STATUS.READY_FOR_PICKUP].includes(workOrder.status) ? `<button type="button" class="secondary-btn" data-status-open-invoice="${workOrder.id}">${invoice?.paid ? "View Invoice" : "Open Invoice / Collect Payment"}</button>` : ""}
                ${workOrder && auth?.role === "admin" && workOrder.status === WORK_ORDER_STATUS.READY_FOR_PICKUP && invoice?.paid ? `<button type="button" class="primary-btn" data-status-completed="${workOrder.id}">Complete Pickup</button>` : ""}
              </div>
            </article>
          `;
        },
        isServiceUser()
          ? "No dispatched appointments are available on the schedule yet."
          : "No appointments in the system yet."
      );

      elements.scheduleList.querySelectorAll("[data-approve-appointment]").forEach((button) => {
        button.addEventListener("click", () => approveAppointment(button.dataset.approveAppointment));
      });
      elements.scheduleList.querySelectorAll("[data-reject-appointment]").forEach((button) => {
        button.addEventListener("click", () => rejectAppointment(button.dataset.rejectAppointment));
      });
      elements.scheduleList.querySelectorAll("[data-update-appointment]").forEach((button) => {
        button.addEventListener("click", () => updateAppointmentServiceDetails(button.dataset.updateAppointment));
      });
      elements.scheduleList.querySelectorAll("[data-edit-appointment]").forEach((button) => {
        button.addEventListener("click", () => editAppointmentDetails(button.dataset.editAppointment));
      });
      elements.scheduleList.querySelectorAll("[data-edit-work-order]").forEach((button) => {
        button.addEventListener("click", () => editLinkedWorkOrder(button.dataset.editWorkOrder));
      });
      elements.scheduleList.querySelectorAll("[data-add-inventory]").forEach((button) => {
        button.addEventListener("click", () => {
          const workOrderId = button.dataset.addInventory;
          const select = elements.scheduleList.querySelector(`[data-part-select="${workOrderId}"]`);
          const quantityInput = elements.scheduleList.querySelector(`[data-part-quantity="${workOrderId}"]`);
          if (!select || !quantityInput || !select.value) {
            window.alert("Choose an inventory item first.");
            return;
          }
          addInventoryToWorkOrder(workOrderId, select.value, quantityInput.value);
        });
      });
      elements.scheduleList.querySelectorAll("[data-status-in-progress]").forEach((button) => {
        button.addEventListener("click", () => updateWorkOrderStatus(button.dataset.statusInProgress, WORK_ORDER_STATUS.IN_PROGRESS));
      });
      elements.scheduleList.querySelectorAll("[data-status-waiting-parts]").forEach((button) => {
        button.addEventListener("click", () => updateWorkOrderStatus(button.dataset.statusWaitingParts, WORK_ORDER_STATUS.WAITING_FOR_PARTS));
      });
      elements.scheduleList.querySelectorAll("[data-status-waiting-approval]").forEach((button) => {
        button.addEventListener("click", () => updateWorkOrderStatus(button.dataset.statusWaitingApproval, WORK_ORDER_STATUS.WAITING_FOR_APPROVAL));
      });
      elements.scheduleList.querySelectorAll("[data-status-on-hold]").forEach((button) => {
        button.addEventListener("click", () => updateWorkOrderStatus(button.dataset.statusOnHold, WORK_ORDER_STATUS.ON_HOLD));
      });
      elements.scheduleList.querySelectorAll("[data-status-resume]").forEach((button) => {
        button.addEventListener("click", () => updateWorkOrderStatus(button.dataset.statusResume, WORK_ORDER_STATUS.IN_PROGRESS));
      });
      elements.scheduleList.querySelectorAll("[data-status-work-completed]").forEach((button) => {
        button.addEventListener("click", () => updateWorkOrderStatus(button.dataset.statusWorkCompleted, WORK_ORDER_STATUS.WORK_COMPLETED));
      });
      elements.scheduleList.querySelectorAll("[data-send-back]").forEach((button) => {
        button.addEventListener("click", () => adminAdvanceWorkOrder(button.dataset.sendBack, WORK_ORDER_STATUS.IN_PROGRESS));
      });
      elements.scheduleList.querySelectorAll("[data-status-verified]").forEach((button) => {
        button.addEventListener("click", () => adminAdvanceWorkOrder(button.dataset.statusVerified, WORK_ORDER_STATUS.VERIFIED));
      });
      elements.scheduleList.querySelectorAll("[data-status-ready]").forEach((button) => {
        button.addEventListener("click", () => adminAdvanceWorkOrder(button.dataset.statusReady, WORK_ORDER_STATUS.READY_FOR_PICKUP));
      });
      elements.scheduleList.querySelectorAll("[data-status-open-invoice]").forEach((button) => {
        button.addEventListener("click", () => openInvoiceForWorkOrder(button.dataset.statusOpenInvoice));
      });
      elements.scheduleList.querySelectorAll("[data-status-completed]").forEach((button) => {
        button.addEventListener("click", () => adminAdvanceWorkOrder(button.dataset.statusCompleted, WORK_ORDER_STATUS.COMPLETED));
      });
    }

    function renderAdminStatusBoard() {
      if (!isAdminUser()) return;

      const pendingAppointments = state.appointments.filter((appointment) => appointment.status === APPOINTMENT_STATUS.PENDING_APPROVAL);
      const ongoing = state.workOrders.filter((workOrder) => [WORK_ORDER_STATUS.ASSIGNED, WORK_ORDER_STATUS.IN_PROGRESS, WORK_ORDER_STATUS.WAITING_FOR_PARTS, WORK_ORDER_STATUS.WAITING_FOR_APPROVAL, WORK_ORDER_STATUS.ON_HOLD].includes(workOrder.status));
      const completed = state.workOrders.filter((workOrder) => workOrder.status === WORK_ORDER_STATUS.WORK_COMPLETED);
      const readyForPickup = state.workOrders.filter((workOrder) => workOrder.status === WORK_ORDER_STATUS.READY_FOR_PICKUP);
      const lowStockParts = state.inventory.filter((part) => part.quantity <= part.reorderPoint);
      const operatorCompletionStats = getOperatorNames().map((operator) => {
        const completedCount = state.workOrders.filter((workOrder) =>
          workOrder.assignedTechnician === operator && workOrder.status === WORK_ORDER_STATUS.COMPLETED
        ).length;
        const qualityGateCount = state.workOrders.filter((workOrder) =>
          workOrder.assignedTechnician === operator && workOrder.status === WORK_ORDER_STATUS.WORK_COMPLETED
        ).length;
        const activeCount = state.workOrders.filter((workOrder) =>
          workOrder.assignedTechnician === operator && [WORK_ORDER_STATUS.ASSIGNED, WORK_ORDER_STATUS.IN_PROGRESS, WORK_ORDER_STATUS.WAITING_FOR_PARTS, WORK_ORDER_STATUS.WAITING_FOR_APPROVAL, WORK_ORDER_STATUS.ON_HOLD].includes(workOrder.status)
        ).length;
        return { operator, completedCount, qualityGateCount, activeCount };
      });
      const bayStatus = BAYS.map((bay) => {
        const activeCount = state.appointments.filter((appointment) =>
          appointment.bay === bay &&
          [APPOINTMENT_STATUS.ASSIGNED, APPOINTMENT_STATUS.IN_PROGRESS, APPOINTMENT_STATUS.WAITING_FOR_PARTS, APPOINTMENT_STATUS.WAITING_FOR_APPROVAL, APPOINTMENT_STATUS.ON_HOLD].includes(appointment.status)
        ).length;
        return `${bay}: ${activeCount ? "Occupied" : "Open"}`;
      });
      const technicianStatus = getOperatorNames().map((operator) => {
        const profile = getTechnicianProfile(operator);
        const activeCount = getTechnicianActiveJobs(operator).length;
        return `${operator}: ${activeCount}/${profile.maxConcurrentJobs} active`;
      });

      elements.adminStatusBoard.innerHTML = `
        <article class="list-card">
          <h4>Pending Appointments</h4>
          <p>${pendingAppointments.length} appointment request(s) need admin review.</p>
        </article>
        <article class="list-card">
          <h4>Ongoing Work</h4>
          <p>${ongoing.length} dispatched or active job(s) are in the shop flow.</p>
        </article>
        <article class="list-card">
          <h4>Quality Gate</h4>
          <p>${completed.length} work order(s) are waiting for admin verification.</p>
        </article>
        <article class="list-card">
          <h4>Ready for Pickup</h4>
          <p>${readyForPickup.length} work order(s) are customer-visible and ready for pickup.</p>
        </article>
        <article class="list-card">
          <h4>Inventory Status</h4>
          ${lowStockParts.length
            ? lowStockParts.map((part) => `
              <div class="list-actions">
                <span class="pill">${part.name} (${part.quantity} in stock, reorder at ${part.reorderPoint})</span>
                <button type="button" class="secondary-btn" data-restock-part="${part.id}">Add Stock</button>
              </div>
            `).join("")
            : "<p>All tracked parts are above reorder threshold.</p>"}
        </article>
        <article class="list-card">
          <h4>Bay Capacity</h4>
          ${bayStatus.map((item) => `<div class="stack-meta"><span class="pill">${item}</span></div>`).join("")}
          <p class="subsection-heading">Operator availability</p>
          ${technicianStatus.map((item) => `<div class="stack-meta"><span class="pill">${item}</span></div>`).join("")}
        </article>
        <article class="list-card">
          <h4>Operator Completion Monitor</h4>
          ${operatorCompletionStats.map((item) => `
            <div class="stack-meta">
              <span class="pill">${item.operator}</span>
              <span class="pill">${item.completedCount} completed</span>
              <span class="pill">${item.qualityGateCount} waiting verification</span>
              <span class="pill">${item.activeCount} active</span>
            </div>
          `).join("")}
        </article>
      `;

      elements.adminStatusBoard.querySelectorAll("[data-restock-part]").forEach((button) => {
        button.addEventListener("click", () => restockInventory(button.dataset.restockPart));
      });
    }

    function renderSearchResults() {
      if (!elements.searchResults) return;
      const query = String(elements.searchQueryField?.value || "").trim().toLowerCase();
      if (!query) {
        elements.searchResults.innerHTML = '<div class="empty-state">Enter a search term to retrieve customer, vehicle, and work-order records.</div>';
        return;
      }

      const customerMatches = state.customers.filter((customer) =>
        [customer.name, customer.email, customer.phone, customer.address].filter(Boolean).some((value) => value.toLowerCase().includes(query))
      );
      const vehicleMatches = state.vehicles.filter((vehicle) =>
        [vehicle.vin, vehicle.make, vehicle.model, String(vehicle.year || ""), getVehicleDisplayName(vehicle)].filter(Boolean).some((value) => value.toLowerCase().includes(query))
      );
      const workOrderMatches = state.workOrders.filter((workOrder) =>
        [workOrder.servicesPerformed, workOrder.faults, workOrder.status, workOrder.assignedTechnician].filter(Boolean).some((value) => value.toLowerCase().includes(query))
      );

      elements.searchResults.innerHTML = `
        ${renderList(customerMatches, (customer) => `<article class="list-card"><h4>Customer · ${customer.name}</h4><p>${customer.email}</p></article>`, "No matching customers.")}
        ${renderList(vehicleMatches, (vehicle) => `<article class="list-card"><h4>Vehicle · ${getVehicleDisplayName(vehicle)}</h4><p>VIN ${vehicle.vin}</p></article>`, "No matching vehicles.")}
        ${renderList(workOrderMatches, (workOrder) => `<article class="list-card"><h4>Work Order · ${workOrder.servicesPerformed}</h4><p>${workOrder.status} · ${workOrder.assignedTechnician || "Unassigned"}</p></article>`, "No matching work orders.")}
      `;
    }

    function startCustomerEdit(customerId) {
      const customer = findCustomer(customerId);
      if (!customer) return;

      elements.customerIdField.value = customer.id;
      elements.customerNameField.value = customer.name;
      elements.customerAddressField.value = customer.address || "";
      elements.customerPhoneField.value = customer.phone;
      elements.customerEmailField.value = customer.email;
      elements.customerLoyaltyField.value = customer.loyaltyTier;
      elements.customerSubmitButton.textContent = "Update Customer";
      elements.customerCancelButton.hidden = false;
      setFormMessage(elements.customerFormMessage, `Editing ${customer.name}. Save to update the record.`);
      elements.customerNameField.focus();
    }

    function startOperatorEdit(operatorId) {
      const operator = getOperatorUsers().find((user) => user.id === operatorId);
      if (!operator) return;

      elements.operatorIdField.value = operator.id;
      elements.operatorNameField.value = operator.name;
      elements.operatorEmailField.value = operator.email;
      elements.operatorSubmitButton.textContent = "Update Operator";
      elements.operatorCancelButton.hidden = false;
      setFormMessage(elements.operatorFormMessage, `Editing ${operator.name}. Save to update the record.`);
      elements.operatorNameField.focus();
    }

    function startVehicleEdit(vehicleId) {
      const vehicle = findVehicle(vehicleId);
      if (!vehicle) return;

      populateCustomerSelect();
      elements.vehicleIdField.value = vehicle.id;
      elements.vehicleCustomerSelect.value = vehicle.customerId;
      elements.vehicleVin.value = vehicle.vin;
      elements.vehicleYearField.value = vehicle.year || "";
      elements.vehicleMakeField.value = vehicle.make || "";
      elements.vehicleModelField.value = vehicle.model || "";
      elements.vehicleMileageField.value = vehicle.mileage;
      elements.vehicleWarrantyField.value = vehicle.warranty || "";
      elements.vehicleCodesField.value = vehicle.codes || "";
      elements.vehicleSubmitButton.textContent = "Update Vehicle";
      elements.vehicleCancelButton.hidden = false;
      validateVINInput();
      setFormMessage(elements.vehicleFormMessage, `Editing ${getVehicleDisplayName(vehicle)}. Save to update the record.`);
      elements.vehicleVin.focus();
    }

    function updateOperatorVehicle(vehicleId) {
      if (!isOperatorUser()) return;

      const vehicle = findVehicle(vehicleId);
      if (!vehicle) return;

      const nextMileageInput = window.prompt("Update mileage for this vehicle.", String(vehicle.mileage ?? ""));
      if (nextMileageInput === null) return;

      const nextMileage = Number(nextMileageInput);
      if (!Number.isFinite(nextMileage) || nextMileage < 0) {
        window.alert("Mileage must be a valid positive value.");
        return;
      }

      const nextCodesInput = window.prompt("Update diagnostic codes for this vehicle.", vehicle.codes || "");
      if (nextCodesInput === null) return;

      state.vehicles = state.vehicles.map((item) =>
        item.id === vehicleId
          ? {
              ...item,
              mileage: nextMileage,
              codes: nextCodesInput.trim()
            }
          : item
      );

      persistState();
      render();
    }

    function startInventoryEdit(partId) {
      if (!isAdminUser()) return;

      const part = state.inventory.find((item) => item.id === partId);
      if (!part) return;

      elements.inventoryIdField.value = part.id;
      elements.inventoryNameField.value = part.name;
      elements.inventorySkuField.value = part.sku;
      elements.inventoryQuantityField.value = part.quantity;
      elements.inventoryReorderField.value = part.reorderPoint;
      elements.inventoryPriceField.value = Number(part.price || 0).toFixed(2);
      elements.inventorySubmitButton.textContent = "Update Part";
      elements.inventoryCancelButton.hidden = false;
      setFormMessage(elements.inventoryMessage, `Editing ${part.name}. Save to update stock, reorder level, or price.`);
      elements.inventoryNameField.focus();
    }

    // =============================
    // CUSTOMER PORTAL RENDERING
    // =============================
    function renderCustomerPortal() {
      if (!isCustomerUser()) return;

      const customer = getCurrentCustomer();
      const vehicles = getCurrentCustomerVehicles();
      const appointments = getCurrentCustomerAppointments();
      const hasUpcomingAppointments = appointments.some((appointment) => new Date(appointment.appointmentAt).getTime() > Date.now());

      elements.portalTitle.textContent = customer ? `${customer.name}'s vehicles` : "My vehicles";
      if (elements.customerAppointmentsTitle) {
        elements.customerAppointmentsTitle.textContent = appointments.length === 0
          ? "View service visits"
          : hasUpcomingAppointments
            ? "View upcoming visits"
            : "View service visit updates";
      }
      const loyalty = customer ? getLoyaltyRecord(customer.id) : { tier: "None", points: 0 };
      elements.customerSummary.innerHTML = customer
        ? `
          <article class="list-card">
            <h4>${customer.name}</h4>
            <p>${customer.email}</p>
            <div class="stack-meta">
              <span class="pill">${customer.address || "No address on file"}</span>
              <span class="pill">${customer.phone}</span>
              <span class="pill">Tier: ${loyalty.tier}</span>
              <span class="pill">${loyalty.points} pts</span>
            </div>
          </article>
        `
        : '<div class="empty-state">This customer account is not linked to a saved profile yet.</div>';

      elements.customerVehicleList.innerHTML = renderList(
        vehicles,
        (vehicle) => `
          <article class="list-card">
            <h4>${getVehicleDisplayName(vehicle)}</h4>
            <p>VIN ${vehicle.vin}</p>
            <div class="stack-meta">
              <span class="pill">${vehicle.year || "Year n/a"}</span>
              <span class="pill">${vehicle.make || "Make n/a"}</span>
              <span class="pill">${vehicle.model || "Model n/a"}</span>
              <span class="pill">${Number(vehicle.mileage).toLocaleString()} miles</span>
            </div>
          </article>
        `,
        "No vehicles are linked to this customer account yet."
      );

      populateCustomerBookingVehicleOptions();
      populateCustomerBookingServiceOptions();
      configureAppointmentInputs();

      elements.customerAppointmentList.innerHTML = renderList(
        appointments,
        (appointment) => {
          const vehicle = findVehicle(appointment.vehicleId);
          const customerVisibleStatus = getCustomerVisibleAppointmentStatus(appointment.status);
          const isReady = appointment.status === APPOINTMENT_STATUS.READY_FOR_PICKUP;
          const isCompleted = appointment.status === APPOINTMENT_STATUS.COMPLETED;
          const isPending = appointment.status === APPOINTMENT_STATUS.PENDING_APPROVAL;
          const isRejected = appointment.status === APPOINTMENT_STATUS.REJECTED;
          const isAssigned = [APPOINTMENT_STATUS.ASSIGNED, APPOINTMENT_STATUS.IN_PROGRESS].includes(appointment.status);
          const canCancel = new Date(appointment.appointmentAt).getTime() > Date.now() &&
            appointment.status !== APPOINTMENT_STATUS.COMPLETED &&
            appointment.status !== APPOINTMENT_STATUS.REJECTED;
          return `
            <article class="list-card">
              <h4>${appointment.serviceType}</h4>
              <p>${getVehicleDisplayName(vehicle)}</p>
              <div class="stack-meta">
                <span class="pill">${formatRecordId("APT", appointment.id)}</span>
                <span class="pill">${formatDate(appointment.appointmentAt)}</span>
                <span class="pill">${getDaysUntilAppointment(appointment.appointmentAt)}</span>
                <span class="pill">${customerVisibleStatus}</span>
              </div>
              <p>${isReady ? "Your vehicle is ready for pickup and payment." : isCompleted ? "Your Vehicle is ready for pick up. Thank you for having business with us." : isPending ? "Your appointment request is waiting for admin approval." : isRejected ? "This request was not approved. Please review the note and book a new time if needed." : isAssigned ? "See you on your appointment." : "Your service request is in progress behind the scenes."}</p>
              <div class="list-actions">
                ${canCancel ? `<button type="button" class="danger-btn" data-cancel-customer-appointment="${appointment.id}">Cancel Appointment</button>` : ""}
              </div>
            </article>
          `;
        },
        "No appointments yet. Add a vehicle first, then submit a service request."
      );

      elements.customerAppointmentList.querySelectorAll("[data-cancel-customer-appointment]").forEach((button) => {
        button.addEventListener("click", () => cancelCustomerAppointment(button.dataset.cancelCustomerAppointment));
      });

      const maintenanceItems = vehicles.flatMap((vehicle) =>
        getMaintenanceChecklist(vehicle).slice(0, 3).map((item) => `
          <article class="list-card">
            <h4>${getVehicleDisplayName(vehicle)} · ${item.name}</h4>
            <p>${item.intervalLabel}</p>
            <div class="stack-meta">
              <span class="pill">${item.dueLabel}</span>
            </div>
          </article>
        `)
      );

      elements.customerMaintenanceList.innerHTML = maintenanceItems.length
        ? maintenanceItems.join("")
        : '<div class="empty-state">Add a vehicle to unlock maintenance recommendations and appointment booking.</div>';
    }

    // =============================
    // TOP-LEVEL APP RENDERING
    // =============================
    function applyAuthView() {
      const loggedIn = Boolean(auth);
      document.body.classList.toggle("auth-ready", loggedIn);
      document.body.classList.toggle("auth-locked", !loggedIn);

      adminOnlyNodes.forEach((node) => {
        node.hidden = !isStaffUser();
      });
      customerOnlyNodes.forEach((node) => {
        node.hidden = !isCustomerUser();
      });
      adminRoleNodes.forEach((node) => {
        node.hidden = !isAdminUser();
      });

      if (!loggedIn) {
        elements.sessionName.textContent = "Guest";
        elements.sessionRole.textContent = "Sign in to access the dashboard";
        return;
      }

      elements.sessionName.textContent = auth.name;
      elements.sessionRole.textContent = isCustomerUser()
        ? "Customer Portal"
        : auth.role === "admin"
          ? "Admin Dashboard"
          : "Operator Dashboard";

      if (isCustomerUser()) {
        elements.heroEyebrow.textContent = "Customer Access";
        elements.heroTitle.textContent = "Track your vehicles and service profile.";
        elements.heroCopy.textContent = "Customer accounts can see only their own profile and linked vehicles.";
      } else {
        elements.heroEyebrow.textContent = "Operations Dashboard";
        elements.heroTitle.textContent = "Run appointments, work orders, inventory, and service history from one screen.";
        elements.heroCopy.textContent = isOperatorUser()
          ? "Operators can update active service jobs, mileage, and diagnostic codes while routing completed work back to admin for approval."
          : "Admin and operator workflows are linked across customer, vehicle, scheduling, work-order, and inventory records stored locally.";
      }

      if (elements.vehiclesTitle) {
        elements.vehiclesTitle.textContent = isOperatorUser() ? "Update vehicle" : "Register a vehicle";
      }
    }

    function render() {
      if (isSessionExpired()) {
        expireSession();
        elements.loginMessage.textContent = "Your session expired after 30 minutes of inactivity.";
      }
      applyAuthView();
      updateLoginValidationState();
      if (!auth) return;

      touchSession();
      populateCustomerSelect();
      populateWorkOrderSelects();
      renderMetrics();
      if (isStaffUser()) {
        renderVehicles();
        renderOperatorJobs();
      }
      if (isAdminUser()) {
        populateAdminBookingSelects();
        renderCustomers();
        renderOperators();
        renderWorkOrders();
        renderInventory();
        renderAdminStatusBoard();
        renderAppointmentQueue();
        renderInvoicePanel();
        renderSearchResults();
      }
      if (isCustomerUser()) {
        renderCustomerPortal();
      }
      updateCustomerFormValidationState();
      updateOperatorFormValidationState();
      updateVehicleFormValidationState();
      updateCustomerVehicleValidationState();
      updateCustomerPasswordValidationState();
      updateCustomerBookingValidationState();
      updateAdminBookingValidationState();
      updateInventoryValidationState();
    }

    // =============================
    // EVENT WIRING
    // =============================
    configureAppointmentInputs();

    document.querySelector('[data-action="seed"]').addEventListener("click", () => {
      state = createDemoState();
      persistState();
      render();
    });

    document.querySelector('[data-action="clear"]').addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      state = normalizeState({});
      render();
    });

    elements.loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const email = String(formData.get("email")).trim().toLowerCase();
      const password = String(formData.get("password"));
      const role = String(formData.get("role"));
      const matchedUser = findUserByCredentials(email, password, role);

      if (!matchedUser) {
        elements.loginMessage.textContent = "Login failed. Check the role, email, and password.";
        return;
      }

      auth = {
        id: matchedUser.id,
        role: matchedUser.role,
        email: matchedUser.email,
        name: matchedUser.name,
        customerId: matchedUser.customerId || null,
        lastActiveAt: Date.now()
      };
      persistAuth();
      lastSessionPersistAt = Number(auth.lastActiveAt);
      elements.loginMessage.textContent = "";
      event.currentTarget.reset();
      render();
    });

    elements.logoutButton.addEventListener("click", () => {
      expireSession();
      render();
      window.setTimeout(clearLoggedOutUiState, 0);
    });

    elements.customerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validateCustomerForm()) return;

      const formData = new FormData(event.currentTarget);
      const customerId = String(formData.get("id") || "");
      const customerRecord = {
        id: customerId || crypto.randomUUID(),
        name: String(formData.get("name")).trim(),
        address: String(formData.get("address")).trim(),
        phone: String(formData.get("phone")).trim(),
        email: String(formData.get("email")).trim(),
        loyaltyTier: String(formData.get("loyaltyTier"))
      };

      if (customerId) {
        state.customers = state.customers.map((customer) => customer.id === customerId ? customerRecord : customer);
        upsertCustomerUser(customerRecord);
        state.loyalty = state.loyalty.map((item) =>
          item.customerId === customerId ? { ...item, tier: customerRecord.loyaltyTier } : item
        );
        if (auth?.customerId === customerId) {
          auth = { ...auth, email: customerRecord.email, name: customerRecord.name };
          persistAuth();
        }
      } else {
        state.customers.unshift(customerRecord);
        upsertCustomerUser(customerRecord);
        state.loyalty.unshift({
          id: crypto.randomUUID(),
          customerId: customerRecord.id,
          points: 0,
          tier: customerRecord.loyaltyTier
        });
        setFormMessage(elements.customerFormMessage, `Customer created. Default temporary password: ${DEFAULT_CUSTOMER_PASSWORD}`);
      }

      persistState();
      render();
      resetCustomerForm();
    });

    elements.customerCancelButton.addEventListener("click", () => {
      resetCustomerForm();
    });

    elements.operatorForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validateOperatorForm()) return;

      const formData = new FormData(event.currentTarget);
      const operatorId = String(formData.get("id") || "");
      const operatorRecord = {
        id: operatorId || `operator-${crypto.randomUUID()}`,
        role: "operator",
        name: String(formData.get("name")).trim(),
        email: String(formData.get("email")).trim().toLowerCase()
      };

      if (operatorId) {
        upsertOperatorUser(operatorRecord);
        if (auth?.id === operatorId) {
          auth = { ...auth, name: operatorRecord.name, email: operatorRecord.email };
          persistAuth();
        }
      } else {
        upsertOperatorUser(operatorRecord);
        setFormMessage(elements.operatorFormMessage, `Operator created. Default temporary password: ${DEFAULT_OPERATOR_PASSWORD}`);
      }

      persistState();
      render();
      resetOperatorForm();
    });

    elements.operatorCancelButton?.addEventListener("click", () => {
      resetOperatorForm();
    });

    elements.searchForm?.addEventListener("input", () => {
      renderSearchResults();
    });

    [elements.loginRole, elements.loginEmailField, elements.loginPasswordField].forEach((field) => {
      field?.addEventListener("input", updateLoginValidationState);
      field?.addEventListener("change", updateLoginValidationState);
    });

    [elements.customerNameField, elements.customerAddressField, elements.customerPhoneField, elements.customerEmailField, elements.customerLoyaltyField].forEach((field) => {
      field?.addEventListener("input", updateCustomerFormValidationState);
      field?.addEventListener("change", updateCustomerFormValidationState);
    });

    [elements.operatorNameField, elements.operatorEmailField].forEach((field) => {
      field?.addEventListener("input", updateOperatorFormValidationState);
      field?.addEventListener("change", updateOperatorFormValidationState);
    });

    [elements.customerCurrentPassword, elements.customerNewPassword, elements.customerConfirmPassword].forEach((field) => {
      field?.addEventListener("input", updateCustomerPasswordValidationState);
      field?.addEventListener("change", updateCustomerPasswordValidationState);
    });

    [elements.customerBookingVehicleSelect, elements.customerBookingServiceSelect, elements.customerAppointmentAt].forEach((field) => {
      field?.addEventListener("input", updateCustomerBookingValidationState);
      field?.addEventListener("change", updateCustomerBookingValidationState);
    });

    [elements.adminBookingCustomerSelect, elements.adminBookingVehicleSelect, elements.adminBookingServiceSelect, elements.adminAppointmentAt].forEach((field) => {
      field?.addEventListener("input", updateAdminBookingValidationState);
      field?.addEventListener("change", updateAdminBookingValidationState);
    });

    [elements.inventoryNameField, elements.inventorySkuField, elements.inventoryQuantityField, elements.inventoryReorderField, elements.inventoryPriceField].forEach((field) => {
      field?.addEventListener("input", updateInventoryValidationState);
      field?.addEventListener("change", updateInventoryValidationState);
    });

    [elements.vehicleCustomerSelect, elements.vehicleYearField, elements.vehicleMakeField, elements.vehicleModelField, elements.vehicleWarrantyField, elements.vehicleCodesField].forEach((field) => {
      field?.addEventListener("input", updateVehicleFormValidationState);
      field?.addEventListener("change", updateVehicleFormValidationState);
    });

    [elements.customerVehicleYearField, elements.customerVehicleMakeField, elements.customerVehicleModelField, elements.customerVehicleWarrantyField, elements.customerVehicleCodesField].forEach((field) => {
      field?.addEventListener("input", updateCustomerVehicleValidationState);
      field?.addEventListener("change", updateCustomerVehicleValidationState);
    });

    ["click", "keydown", "touchstart"].forEach((eventName) => {
      document.addEventListener(eventName, () => {
        if (auth) {
          touchSession();
        }
      }, { passive: true });
    });

    elements.workOrderCustomerSelect?.addEventListener("change", () => {
      populateWorkOrderSelects();
    });

    elements.workOrderAppointmentSelect?.addEventListener("change", () => {
      populateWorkOrderSelects();
    });

    elements.workOrderForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const appointmentId = String(formData.get("appointmentId"));
      const customerId = String(formData.get("customerId"));
      const vehicleId = String(formData.get("vehicleId"));
      const servicesPerformed = String(formData.get("servicesPerformed"));
      const assignedTechnician = String(formData.get("assignedTechnician"));

      if (!appointmentId || !customerId || !vehicleId || !servicesPerformed || !assignedTechnician) {
        setFormMessage(elements.workOrderMessage, "Complete all work order fields before saving.");
        window.alert("Please complete all work order fields.");
        return;
      }

      const appointment = state.appointments.find((item) => item.id === appointmentId);
      if (!appointment || appointment.status !== APPOINTMENT_STATUS.ASSIGNED) {
        setFormMessage(elements.workOrderMessage, "Choose a dispatched appointment before creating a work order.");
        window.alert("Choose a dispatched appointment before creating a work order.");
        return;
      }

      if (appointment.customerId !== customerId || appointment.vehicleId !== vehicleId) {
        setFormMessage(elements.workOrderMessage, "The customer and vehicle must match the selected appointment.");
        window.alert("The customer and vehicle must match the selected appointment.");
        return;
      }

      const timestamp = new Date().toISOString();
      const existingWorkOrder = findWorkOrderByAppointment(appointmentId);
      if (existingWorkOrder) {
        state.workOrders = state.workOrders.map((workOrder) =>
          workOrder.id === existingWorkOrder.id
            ? {
                ...workOrder,
                customerId,
                vehicleId,
                assignedTechnician,
                servicesPerformed,
                faults: String(formData.get("faults")).trim()
              }
            : workOrder
        );
        setFormMessage(elements.workOrderMessage, "Work order details updated. Use Scheduling to mark work completed and send it for admin verification.");
      } else {
        state.workOrders.unshift({
          id: crypto.randomUUID(),
          customerId,
          vehicleId,
          appointmentId,
          assignedTechnician,
          servicesPerformed,
          status: WORK_ORDER_STATUS.ASSIGNED,
          faults: String(formData.get("faults")).trim(),
          createdAt: timestamp,
          startedAt: "",
          readyForPickupAt: "",
          completedAt: "",
          verifiedAt: "",
          invoice: {
            laborCost: 0,
            otherCost: 0,
            otherDescription: "",
            paid: false,
            paidAt: "",
            paidBy: ""
          }
        });
        syncAppointmentStatusFromWorkOrder({ appointmentId }, WORK_ORDER_STATUS.ASSIGNED, timestamp);
        setFormMessage(elements.workOrderMessage, "Linked work order created. Use Scheduling when the operator is ready to start or complete the job.");
      }

      persistState();
      event.currentTarget.reset();
      render();
    });

    elements.inventoryForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const partId = String(formData.get("id") || "");
      const name = String(formData.get("name")).trim();
      const sku = String(formData.get("sku")).trim().toUpperCase();
      const quantity = Number(formData.get("quantity"));
      const reorderPoint = Number(formData.get("reorderPoint"));
      const price = Number(formData.get("price"));

      if (!name || !sku || !Number.isFinite(quantity) || !Number.isFinite(reorderPoint) || !Number.isFinite(price)) {
        setFormMessage(elements.inventoryMessage, "Complete all inventory fields before saving.");
        window.alert("Please complete all inventory fields.");
        return;
      }

      if (quantity < 0 || reorderPoint < 0 || price < 0) {
        setFormMessage(elements.inventoryMessage, "Inventory values must be zero or greater.");
        window.alert("Inventory values must be zero or greater.");
        return;
      }

      const inventoryRecord = {
        id: partId || crypto.randomUUID(),
        name,
        sku,
        quantity,
        reorderPoint,
        price
      };

      if (partId) {
        state.inventory = state.inventory.map((part) => part.id === partId ? inventoryRecord : part);
        setFormMessage(elements.inventoryMessage, `${name} updated successfully.`);
      } else {
        state.inventory.unshift(inventoryRecord);
      }

      persistState();
      resetInventoryForm();
      render();
    });

    elements.inventoryCancelButton?.addEventListener("click", () => {
      resetInventoryForm();
    });

    elements.invoiceForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      saveInvoiceDraft();
    });

    elements.invoiceAddMaterialButton?.addEventListener("click", () => {
      const workOrderId = String(elements.invoiceWorkOrderIdField?.value || selectedInvoiceWorkOrderId || "");
      if (!workOrderId) {
        window.alert("Select a work order before adding materials to the invoice.");
        return;
      }

      const partId = String(elements.invoiceMaterialSelect?.value || "");
      const quantity = String(elements.invoiceMaterialQuantityField?.value || "1");
      if (!partId) {
        window.alert("Choose an inventory item to add.");
        return;
      }

      invoicePanelNotice = "Material added to the invoice from inventory.";
      addInventoryToWorkOrder(workOrderId, partId, quantity);
    });

    elements.invoiceMarkPaidButton?.addEventListener("click", () => {
      markInvoicePaid();
    });

    elements.vehicleVin.addEventListener("input", () => {
      validateVINInput();
      updateVehicleFormValidationState();
    });
    elements.vehicleVin.addEventListener("blur", () => {
      validateVINInput();
      updateVehicleFormValidationState();
    });
    elements.vehicleMileageField.addEventListener("input", () => {
      if (Number(elements.vehicleMileageField.value) >= 0) {
        elements.vehicleMileageField.classList.remove("is-invalid");
        clearFormMessage(elements.vehicleFormMessage);
      }
      updateVehicleFormValidationState();
    });

    elements.vehicleForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!isAdminUser()) {
        window.alert("Only admin can register or fully edit vehicles.");
        return;
      }
      if (!validateVehicleForm()) return;

      const formData = new FormData(event.currentTarget);
      const vehicleId = String(formData.get("id") || "");
      const vehicleRecord = {
        id: vehicleId || crypto.randomUUID(),
        customerId: String(formData.get("customerId")),
        vin: String(formData.get("vin")).trim().toUpperCase(),
        year: Number(formData.get("year")),
        make: String(formData.get("make")).trim(),
        model: String(formData.get("model")).trim(),
        mileage: Number(formData.get("mileage")),
        warranty: String(formData.get("warranty")).trim(),
        codes: String(formData.get("codes")).trim()
      };

      if (vehicleId) {
        state.vehicles = state.vehicles.map((vehicle) => vehicle.id === vehicleId ? vehicleRecord : vehicle);
      } else {
        state.vehicles.unshift(vehicleRecord);
      }

      resetVehicleForm();
      persistState();
      render();
    });

    elements.vehicleCancelButton.addEventListener("click", () => {
      resetVehicleForm();
    });

    elements.customerVehicleVin?.addEventListener("input", () => {
      validateCustomerPortalVIN();
      updateCustomerVehicleValidationState();
    });
    elements.customerVehicleVin?.addEventListener("blur", () => {
      validateCustomerPortalVIN();
      updateCustomerVehicleValidationState();
    });
    elements.customerVehicleMileageField?.addEventListener("input", () => {
      if (Number(elements.customerVehicleMileageField.value) >= 0) {
        elements.customerVehicleMileageField.classList.remove("is-invalid");
        clearFormMessage(elements.customerVehicleFormMessage);
      }
      updateCustomerVehicleValidationState();
    });

    elements.customerVehicleForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validateCustomerVehicleForm()) return;

      const customer = getCurrentCustomer();
      if (!customer) return;

      const formData = new FormData(event.currentTarget);
      state.vehicles.unshift({
        id: crypto.randomUUID(),
        customerId: customer.id,
        vin: String(formData.get("vin")).trim().toUpperCase(),
        year: Number(formData.get("year")),
        make: String(formData.get("make")).trim(),
        model: String(formData.get("model")).trim(),
        mileage: Number(formData.get("mileage")),
        warranty: String(formData.get("warranty") || "").trim(),
        codes: String(formData.get("codes") || "").trim()
      });

      persistState();
      render();
      resetCustomerVehicleForm();
      setFormMessage(elements.customerBookingMessage, "Vehicle added. You can now book an appointment.");
    });

    elements.customerPasswordForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const updated = changeCustomerPassword();
      if (!updated) return;
      resetCustomerPasswordForm();
      setFormMessage(elements.customerPasswordMessage, "Password updated successfully.");
    });

    elements.customerBookingForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const customer = getCurrentCustomer();
      const vehicles = getCurrentCustomerVehicles();
      if (!customer) return;

      if (!vehicles.length) {
        setFormMessage(elements.customerBookingMessage, "Add a vehicle before creating an appointment.");
        window.alert("Add a vehicle before creating an appointment.");
        return;
      }

      const formData = new FormData(event.currentTarget);
      const appointmentAtValue = String(formData.get("appointmentAt"));
      const appointmentAt = new Date(appointmentAtValue);

      if (!formData.get("vehicleId") || !formData.get("serviceType") || !appointmentAtValue || Number.isNaN(appointmentAt.getTime())) {
        setFormMessage(elements.customerBookingMessage, "Complete all appointment fields before booking.");
        window.alert("Please complete all appointment fields.");
        return;
      }

      if (appointmentAt < new Date()) {
        setFormMessage(elements.customerBookingMessage, "Choose a future appointment time.");
        window.alert("Choose a future appointment time.");
        return;
      }

      if (!isOnTheHour(appointmentAt)) {
        setFormMessage(elements.customerBookingMessage, "Appointments must be booked on the hour.");
        window.alert("Appointments must be booked on the hour.");
        return;
      }

      if (!isWithinBusinessHours(appointmentAt)) {
        setFormMessage(elements.customerBookingMessage, "Appointments must be booked between 9:00 AM and 5:00 PM.");
        window.alert("Appointments must be booked between 9:00 AM and 5:00 PM.");
        return;
      }

      const vehicleId = String(formData.get("vehicleId"));
      const appointmentIso = appointmentAt.toISOString();
      if (hasDuplicateAppointment(vehicleId, appointmentIso)) {
        setFormMessage(elements.customerBookingMessage, "A duplicate appointment already exists for this vehicle at that time.");
        window.alert("A duplicate appointment already exists for this vehicle at that time.");
        return;
      }

      state.appointments.unshift({
        id: crypto.randomUUID(),
        customerId: customer.id,
        vehicleId,
        appointmentAt: appointmentIso,
        serviceType: String(formData.get("serviceType")),
        bookingNote: String(formData.get("bookingNote")).trim(),
        approved: false,
        approvedByAdmin: "",
        assignedOperator: "",
        bay: "",
        estimatedDurationHours: 1,
        status: APPOINTMENT_STATUS.PENDING_APPROVAL,
        faults: "",
        inventoryUsed: "",
        laborStartedAt: "",
        notificationSentAt: ""
      });

      const createdAppointment = state.appointments[0];

      persistState();
      render();
      resetCustomerBookingForm();
      setFormMessage(elements.customerBookingMessage, `Appointment submitted with PENDING_APPROVAL status. ID: ${formatRecordId("APT", createdAppointment.id)}.`);
    });

    elements.adminBookingCustomerSelect?.addEventListener("change", () => {
      populateAdminBookingSelects();
    });

    elements.adminBookingForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!isAdminUser()) return;

      const formData = new FormData(event.currentTarget);
      const customerId = String(formData.get("customerId"));
      const vehicleId = String(formData.get("vehicleId"));
      const serviceType = String(formData.get("serviceType"));
      const appointmentAtValue = String(formData.get("appointmentAt"));
      const appointmentAt = new Date(appointmentAtValue);

      if (!customerId || !vehicleId || !serviceType || !appointmentAtValue || Number.isNaN(appointmentAt.getTime())) {
        setFormMessage(elements.adminBookingMessage, "Complete all appointment fields before booking.");
        window.alert("Please complete all appointment fields.");
        return;
      }

      if (!isOnTheHour(appointmentAt)) {
        setFormMessage(elements.adminBookingMessage, "Appointments must be booked on the hour.");
        window.alert("Appointments must be booked on the hour.");
        return;
      }

      if (!isWithinBusinessHours(appointmentAt)) {
        setFormMessage(elements.adminBookingMessage, "Appointments must be booked between 9:00 AM and 5:00 PM.");
        window.alert("Appointments must be booked between 9:00 AM and 5:00 PM.");
        return;
      }

      const appointmentIso = appointmentAt.toISOString();
      if (hasDuplicateAppointment(vehicleId, appointmentIso)) {
        setFormMessage(elements.adminBookingMessage, "A duplicate appointment already exists for this vehicle at that time.");
        window.alert("A duplicate appointment already exists for this vehicle at that time.");
        return;
      }

      const appointment = {
        id: crypto.randomUUID(),
        customerId,
        vehicleId,
        appointmentAt: appointmentIso,
        serviceType,
        bookingNote: String(formData.get("bookingNote")).trim(),
        approved: false,
        approvedByAdmin: "",
        assignedOperator: "",
        bay: "",
        estimatedDurationHours: 1,
        status: APPOINTMENT_STATUS.PENDING_APPROVAL,
        faults: "",
        inventoryUsed: "",
        laborStartedAt: "",
        notificationSentAt: ""
      };

      state.appointments.unshift(appointment);

      persistState();
      render();
      resetAdminBookingForm();
      setFormMessage(elements.adminBookingMessage, `Appointment created. Admin assignment is still required. ID: ${formatRecordId("APT", appointment.id)}.`);
    });

    // =============================
    // INITIAL LOAD
    // =============================
    render();
