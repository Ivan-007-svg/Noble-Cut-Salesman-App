document.addEventListener('DOMContentLoaded', async function () {

// --- FIREBASE SETUP ---
const firebaseConfig = {
  apiKey: "AIzaSyATvsgeJE6i7Q6vcXEd4Lo5fxZwASQNqsY",
  authDomain: "noble-cut.firebaseapp.com",
  projectId: "noble-cut",
  storageBucket: "noble-cut.appspot.com",
  messagingSenderId: "823877688810",
  appId: "1:823877688810:web:edcb9dd10fcb08984b6693"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

////////////////////////////////////////////////////////////////////////////////
// 1. TRANSLATIONS AND LANGUAGE LOGIC
////////////////////////////////////////////////////////////////////////////////

const translations = {
  EN: {
    "Client & Order Info": "Client & Order Info",
    "Fabric & Button Info": "Fabric & Button Info",
    "Shirt Line & Model Info": "Shirt Line & Model Info",
    "Measurements Part 1": "Measurements Part 1",
    "Measurements Part 2 & Notes": "Measurements Part 2 & Notes",
    "Client Name": "Client Name",
    "Contact Info": "Contact Info",
    "Order ID": "Order ID",
    "Ordered Quantity": "Ordered Quantity",
    "Order Date": "Order Date",
    "Delivery Date": "Delivery Date",
    "Fabric Supplier": "Fabric Supplier",
    "Fabric Code": "Fabric Code",
    "Fabric Color": "Fabric Color",
    "Fabric Description": "Fabric Description",
    "Fabric Consumption per Shirt": "Fabric Consumption per Shirt",
    "Button Supplier": "Button Supplier",
    "Button Article": "Button Article",
    "Button Color": "Button Color",
    "Shirt Line": "Shirt Line",
    "Pattern": "Pattern",
    "Collar Style": "Collar Style",
    "Cuff Style": "Cuff Style",
    "Placket Style": "Placket Style",
    "Monogram": "Monogram",
    "Monogram Text": "Monogram Text",
    "Monogram Placement": "Monogram Placement",
    "Monogram Color": "Monogram Color",
    "Neck (cm)": "Neck (cm)",
    "Chest (cm)": "Chest (cm)",
    "Waist (cm)": "Waist (cm)",
    "Hips (cm)": "Hips (cm)",
    "Shoulder Width (cm)": "Shoulder Width (cm)",
    "Across Shoulder": "Across Shoulder",
    "Back Width": "Back Width",
    "Sleeve Length (cm)": "Sleeve Length (cm)",
    "Bicep (cm)": "Bicep (cm)",
    "Under Elbow": "Under Elbow",
    "Wrist (cm) Left": "Wrist (cm) Left",
    "Wrist (cm) Right": "Wrist (cm) Right",
    "Shirt Length (cm)": "Shirt Length (cm)",
    "Order Notes": "Order Notes",
    "Back": "Back",
    "Next": "Next",
    "Submit": "Submit",
    "Available": "Available",
    "meters": "meters"
  },
  SR: {
    "Client & Order Info": "Podaci o klijentu i narudžbini",
    "Fabric & Button Info": "Tkanina i dugmad",
    "Shirt Line & Model Info": "Linija i model košulje",
    "Measurements Part 1": "Mere deo 1",
    "Measurements Part 2 & Notes": "Mere deo 2 i napomene",
    "Client Name": "Ime klijenta",
    "Contact Info": "Kontakt podaci",
    "Order ID": "Broj naloga",
    "Ordered Quantity": "Količina",
    "Order Date": "Datum porudžbine",
    "Delivery Date": "Datum isporuke",
    "Fabric Supplier": "Dobavljač tkanine",
    "Fabric Code": "Šifra tkanine",
    "Fabric Color": "Boja tkanine",
    "Fabric Description": "Opis tkanine",
    "Fabric Consumption per Shirt": "Potrošnja tkanine po košulji",
    "Button Supplier": "Dobavljač dugmadi",
    "Button Article": "Šifra dugmadi",
    "Button Color": "Boja dugmadi",
    "Shirt Line": "Linija košulje",
    "Pattern": "Kroj",
    "Collar Style": "Tip kragne",
    "Cuff Style": " Tip manžete",
    "Placket Style": "Prednja lajsna",
    "Monogram": "Monogram",
    "Monogram Text": "Slova monograma",
    "Monogram Placement": "Pozicija monograma",
    "Monogram Color": "Boja monograma",
    "Neck (cm)": "Vrat (cm)",
    "Chest (cm)": "Grudi (cm)",
    "Waist (cm)": "Struk (cm)",
    "Hips (cm)": "Kukovi (cm)",
    "Shoulder Width (cm)": "Širina ramena (cm)",
    "Across Shoulder": "Preko ramena",
    "Back Width": "Širina leđa",
    "Sleeve Length (cm)": "Dužina rukava (cm)",
    "Bicep (cm)": "Biceps (cm)",
    "Under Elbow": "Ispod lakta",
   "Wrist (cm) Left": "Ručni zglob (cm) levi",
"Wrist (cm) Right": "Ručni zglob (cm) desni",
    "Shirt Length (cm)": "Dužina košulje (cm)",
    "Order Notes": "Napomene",
    "Back": "Nazad",
    "Next": "Dalje",
    "Submit": "Pošalji",
    "Available": "Dostupno",
    "meters": "metara"
  }
};

let currentLang = 'EN';
let isSummaryView = false; // For summary detection

const app = document.getElementById('app');
let fabricData = [];
let dropdownOptions = {
    'Fabric Supplier': [],
    'Fabric Code': [],
    'Fabric Color': [],
    'Fabric Description': []
};

const steps = [
    {
        title: 'Client & Order Info',
        fields: ['Client Name', 'Contact Info', 'Order ID', 'Ordered Quantity', 'Order Date', 'Delivery Date']
    },
    {
        title: 'Fabric & Button Info',
        fields: ['Fabric Supplier', 'Fabric Code', 'Fabric Color', 'Fabric Description', 'Fabric Consumption per Shirt', 'Button Supplier', 'Button Article', 'Button Color']
    },
    {
        title: 'Shirt Line & Model Info',
        fields: ['Shirt Line', 'Pattern', 'Collar Style', 'Cuff Style', 'Placket Style', 'Monogram', 'Monogram Text', 'Monogram Placement', 'Monogram Color']
    },
    {
        title: 'Measurements Part 1',
        fields: ['Neck (cm)', 'Chest (cm)', 'Waist (cm)', 'Hips (cm)', 'Shoulder Width (cm)', 'Across Shoulder', 'Back Width']
    },
    {
        title: 'Measurements Part 2 & Notes',
        fields: ['Sleeve Length (cm)', 'Bicep (cm)', 'Under Elbow', 'Wrist (cm) Left', 'Wrist (cm) Right', 'Shirt Length (cm)', 'Order Notes']
    }
];

let currentStep = 0;
const formData = {};
let orderCounter = parseInt(localStorage.getItem('nobleCutOrderCounter') || '1');

// ----------- ASYNC UTILITY FUNCTIONS -----------

async function generateOrderIDFromFirestore() {
    const counterRef = db.collection("counters").doc("orderCounter");
    const year = new Date().getFullYear().toString().slice(-2);
    let newOrderNumber;

    await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(counterRef);
        const data = doc.exists ? doc.data() : {};
        const lastOrderNumber = data.lastOrderNumber || 0;
        const lastYear = data.year || year;

        newOrderNumber = (lastYear === year) ? lastOrderNumber + 1 : 1;

        transaction.set(counterRef, {
            lastOrderNumber: newOrderNumber,
            year: year
        });
    });

    const padded = String(newOrderNumber).padStart(5, '0');
    return `NC-${padded}-${year}`;
}

async function saveOrderToFirebase(order) {
  try {
    const orderedData = {
      'Client Name': formData['Client Name'],
      'Contact Info': formData['Contact Info'],
      'Order ID': formData['Order ID'],
      'Ordered Quantity': formData['Ordered Quantity'],
      'Order Date': formData['Order Date'],
      'Delivery Date': formData['Delivery Date'],
      'Fabric Supplier': formData['Fabric Supplier'],
      'Fabric Code': formData['Fabric Code'],
      'Fabric Color': formData['Fabric Color'],
      'Fabric Description': formData['Fabric Description'],
      'Fabric Consumption per Shirt': formData['Fabric Consumption per Shirt'],
      'Button Supplier': formData['Button Supplier'],
      'Button Article': formData['Button Article'],
      'Button Color': formData['Button Color'],
      'Shirt Line': formData['Shirt Line'],
      'Pattern': formData['Pattern'],
      'Collar Style': formData['Collar Style'],
      'Cuff Style': formData['Cuff Style'],
      'Placket Style': formData['Placket Style'],
      'Monogram': formData['Monogram'],
      'Monogram Text': formData['Monogram Text'],
      'Monogram Placement': formData['Monogram Placement'],
      'Monogram Color': formData['Monogram Color'],
      'Neck (cm)': formData['Neck (cm)'],
      'Chest (cm)': formData['Chest (cm)'],
      'Waist (cm)': formData['Waist (cm)'],
      'Hips (cm)': formData['Hips (cm)'],
      'Shoulder Width (cm)': formData['Shoulder Width (cm)'],
      'Across Shoulder': formData['Across Shoulder'],
      'Back Width': formData['Back Width'],
      'Sleeve Length (cm)': formData['Sleeve Length (cm)'],
      'Bicep (cm)': formData['Bicep (cm)'],
      'Under Elbow': formData['Under Elbow'],
      'Wrist (cm) Left': formData['Wrist (cm) Left'],
      'Wrist (cm) Right': formData['Wrist (cm) Right'],
      'Shirt Length (cm)': formData['Shirt Length (cm)'],
      'Order Notes': formData['Order Notes']
    };
    await db.collection('orders').doc(orderedData['Order ID']).set(orderedData);
    console.log("Order saved to Firebase:", order["Order ID"]);
  } catch (e) {
    console.error("Error saving to Firebase:", e);
  }
}

// ----------- LOAD FABRIC DATA -----------

(async () => {
  try {
    const snapshot = await db.collection('fabricRolls').get();
    const rawData = snapshot.docs.map(doc => doc.data());
    fabricData = rawData
      .filter(row => row['article'])
      .map(row => ({
        ...row,
        'Fabric Code': row['article'],
        'Fabric Supplier': row['supplier'],
        'Fabric Color': row['color'],
        'Fabric Description': row['description']
      }));
    for (let row of fabricData) {
      Object.keys(dropdownOptions).forEach(key => {
        if (row[key] && !dropdownOptions[key].includes(row[key])) {
          dropdownOptions[key].push(row[key]);
        }
      });
    }
  } catch (error) {
    console.error("Error fetching fabric data:", error);
  }
})();

// ----------- UI AND LOGIC -----------

function createLanguageToggle() {
  let bar = document.getElementById('langBar');
  if (bar) bar.remove();
  bar = document.createElement('div');
  bar.id = 'langBar';
  bar.style.position = 'absolute';
  bar.style.top = '25px';
  bar.style.left = '25px';
  bar.style.display = 'flex';
  bar.style.flexDirection = 'row';
  bar.style.gap = '8px';
  bar.style.zIndex = '999';

  const GOLD = '#e2be6a';
  const BLACK = '#111';

  const enBtn = document.createElement('button');
  enBtn.textContent = 'EN';
  const srBtn = document.createElement('button');
  srBtn.textContent = 'SR';

  function styleBtn(btn, active) {
    btn.style.background = active ? GOLD : 'transparent';
    btn.style.color = active ? BLACK : GOLD;
    btn.style.border = '1.5px solid ' + GOLD;
    btn.style.fontWeight = '600';
    btn.style.fontSize = '15px';
    btn.style.borderRadius = '8px';
    btn.style.padding = '8px 20px';
    btn.style.transition = 'all 0.18s cubic-bezier(.4,0,.2,1)';
    btn.style.cursor = 'pointer';
    btn.style.margin = '0';
    btn.style.outline = 'none';
    btn.style.boxShadow = active ? '0 2px 8px #FFD70040' : 'none';
    btn.onmouseenter = () => {
      if (!active) {
        btn.style.background = GOLD;
        btn.style.color = BLACK;
      }
    };
    btn.onmouseleave = () => {
      if (!active) {
        btn.style.background = 'transparent';
        btn.style.color = GOLD;
      }
    };
    btn.onfocus = () => btn.style.boxShadow = '0 0 0 2px #e2be6a55';
    btn.onblur = () => btn.style.boxShadow = active ? '0 2px 8px #FFD70040' : 'none';
  }

  function updateLangButtonStyles() {
    styleBtn(enBtn, currentLang === 'EN');
    styleBtn(srBtn, currentLang === 'SR');
  }

  enBtn.onclick = () => {
    saveStepData();
    currentLang = 'EN';
    if (isSummaryView) {
      showOrderSummary();
    } else {
      renderStep();
    }
    updateLangButtonStyles();
  };
  srBtn.onclick = () => {
    saveStepData();
    currentLang = 'SR';
    if (isSummaryView) {
      showOrderSummary();
    } else {
      renderStep();
    }
    updateLangButtonStyles();
  };

  bar.appendChild(enBtn);
  bar.appendChild(srBtn);
  document.body.appendChild(bar);

  updateLangButtonStyles();
}

function renderStep() {
  isSummaryView = false;
  createStep(currentStep);
}

function createStep(stepIndex) {
    isSummaryView = false;
    app.innerHTML = '';
    createLanguageToggle();

    const step = steps[stepIndex];
    const section = document.createElement('section');
    const title = document.createElement('h2');
    title.textContent = translations[currentLang][step.title];
    section.appendChild(title);

    step.fields.forEach(field => {
        const label = document.createElement('label');
        label.textContent = translations[currentLang][field] || field;
        let input;

        if (field === 'Monogram') {
            input = document.createElement('select');
            ['-- Select --', 'YES', 'NO'].forEach(optionText => {
                const option = document.createElement('option');
                option.value = optionText === '-- Select --' ? '' : optionText;
                option.textContent = optionText;
                input.appendChild(option);
            });
        } else if (field === 'Order ID') {
            input = document.createElement('input');
            input.type = 'text';
            input.name = field;
            input.value = 'Will be generated on submit';
            input.readOnly = true;
        } else if (field === 'Order Date') {
            input = document.createElement('input');
            input.type = 'text';
            input.name = field;
            input.value = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
            input.readOnly = true;
        } else if (field === 'Delivery Date') {
            input = document.createElement('input');
            input.type = 'date';
            input.name = field;
            if (formData[field]) input.value = formData[field];
            input.addEventListener('change', () => {
                formData[field] = input.value;
            });
        } else if (dropdownOptions[field]) {
            input = document.createElement('select');
            input.name = field;
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '-- Select --';
            input.appendChild(defaultOption);
            dropdownOptions[field].forEach(optionValue => {
                const option = document.createElement('option');
                option.value = optionValue;
                option.textContent = optionValue;
                input.appendChild(option);
            });
        } else {
            input = document.createElement('input');
            input.type = 'text';
            input.name = field;
            input.value = formData[field] || '';
        }

        input.name = field;
        label.appendChild(input);

        if (field === 'Fabric Code') {
            const availableDiv = document.createElement('div');
            availableDiv.style.color = '#FFD700';
            availableDiv.style.fontSize = '1em';
            availableDiv.style.marginTop = '2px';
            availableDiv.textContent = '';
            input.addEventListener('change', async (e) => {
                const code = e.target.value;
                if (code) {
                    const snapshot = await db.collection('fabricRolls').where('article', '==', code).get();
                    let totalAvailable = 0;
                    snapshot.docs.forEach(doc => {
                        const d = doc.data();
                        totalAvailable += (parseFloat(d.totalMeters) - parseFloat(d.reservedMeters || 0) - parseFloat(d.spentMeters || 0));
                    });
                    availableDiv.textContent = `${translations[currentLang]["Available"]}: ${totalAvailable.toFixed(2)} ${translations[currentLang]["meters"]}`;
                } else {
                    availableDiv.textContent = '';
                }
            });
            label.appendChild(availableDiv);
        }

        section.appendChild(label);
    });

    const buttonContainer = document.createElement('div');
    if (stepIndex > 0) {
        const backBtn = document.createElement('button');
        backBtn.textContent = translations[currentLang]["Back"];
        backBtn.onclick = function () {
            saveStepData();
            currentStep--;
            renderStep();
        };
        buttonContainer.appendChild(backBtn);
    }

    if (stepIndex < steps.length - 1) {
        const nextBtn = document.createElement('button');
        nextBtn.textContent = translations[currentLang]["Next"];
        nextBtn.onclick = function () {
            saveStepData();
            currentStep++;
            renderStep();
        };
        buttonContainer.appendChild(nextBtn);
    } else {
        const submitBtn = document.createElement('button');
        submitBtn.textContent = translations[currentLang]["Submit"];
        submitBtn.onclick = async function () {
            saveStepData();
            const orderID = await generateOrderIDFromFirestore();
            formData['Order ID'] = orderID;
            const orderIDInput = document.querySelector('input[name="Order ID"]');
            if (orderIDInput) orderIDInput.value = orderID;

            formData['Order Date'] = formatDate(new Date());

            const code = formData['Fabric Code']?.trim().toLowerCase();
            const consumption = parseFloat(formData['Fabric Consumption per Shirt'] || 0);
            const quantity = parseInt(formData['Ordered Quantity'] || 0);
            const required = consumption * quantity;

            try {
                await saveOrderToFirebase();

                const snapshot = await db.collection('fabricRolls').get();
                const matchingRolls = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(doc => doc.article?.trim().toLowerCase() === code);

                const totalAvailable = matchingRolls.reduce((sum, roll) => {
                    const total = parseFloat(roll.totalMeters) || 0;
                    const reserved = parseFloat(roll.reservedMeters) || 0;
                    const spent = parseFloat(roll.spentMeters) || 0;
                    return sum + (total - reserved - spent);
                }, 0);

                if (required > totalAvailable) {
                    const finalBalance = totalAvailable - required;
                    let warningMsg;
                    if (currentLang === 'SR') {
                        warningMsg =
                          `⚠️ UPOZORENJE:\n` +
                          `Dostupno: ${totalAvailable.toFixed(2)} metara\n` +
                          `Ova rezervacija će smanjiti stanje na ${finalBalance.toFixed(2)} metara.\n\n` +
                          `Da li želite da nastavite?`;
                    } else {
                        warningMsg =
                          `⚠️ WARNING:\n` +
                          `Available: ${totalAvailable.toFixed(2)} meters\n` +
                          `This reservation will reduce stock to ${finalBalance.toFixed(2)} meters.\n\n` +
                          `Do you want to proceed?`;
                    }
                    const proceed = window.confirm(warningMsg);
                    if (!proceed) return;
                }

                let remaining = required;
                const assignedRolls = [];
                const sortedRolls = matchingRolls.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));

                for (let i = 0; i < sortedRolls.length; i++) {
                    const roll = sortedRolls[i];
                    if (remaining <= 0) break;

                    const currentReserved = parseFloat(roll.reservedMeters) || 0;
                    const currentSpent = parseFloat(roll.spentMeters) || 0;
                    const currentTotal = parseFloat(roll.totalMeters) || 0;
                    const available = Math.max(currentTotal - currentReserved - currentSpent, 0);

                    const toReserve = Math.min(available, remaining);
                    const isLastRoll = i === sortedRolls.length - 1;
                    const reserveFromRoll = isLastRoll ? remaining : toReserve;

                    const newReservedTotal = Math.round((currentReserved + reserveFromRoll) * 100) / 100;
                    const newAvailable = Math.round((currentTotal - newReservedTotal - currentSpent) * 100) / 100;

                    const docRef = db.collection('fabricRolls').doc(roll.id);
                    await docRef.update({
                        reservedMeters: newReservedTotal,
                        availableMeters: newAvailable
                    });

                    assignedRolls.push({
                        rollNumber: roll.rollNumber,
                        reserved: reserveFromRoll
                    });

                    remaining -= reserveFromRoll;
                }

                await db.collection('orders').doc(orderID).update({
                    "Assigned Rolls": assignedRolls
                });
                showToast(currentLang === "EN" ? 'Order submitted successfully!' : 'Porudžbina uspešno poslata!');
                showOrderSummary();

            } catch (e) {
                console.error('Submission failed:', e);
                showToast('⚠️ Failed to submit order or reserve fabric.');
            }
        };
        buttonContainer.appendChild(submitBtn);
    }

    section.appendChild(buttonContainer);
    app.appendChild(section);

    setTimeout(() => {
      const deliveryInput = document.querySelector('input[name="Delivery Date"]');
      if (deliveryInput && window.flatpickr) {
        flatpickr(deliveryInput, {
          dateFormat: "Y-m-d",
          defaultDate: deliveryInput.value || "today",
          altInput: false
        });
      }
      if (!window.flatpickr) {
        const flatpickrScript = document.createElement('script');
        flatpickrScript.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
        flatpickrScript.onload = () => {
          const input = document.querySelector('input[name="Delivery Date"]');
          if (input) {
            flatpickr(input, {
              dateFormat: "Y-m-d",
              defaultDate: input.value || "today",
              altInput: false
            });
          }
        };
        document.head.appendChild(flatpickrScript);
        const flatpickrCSS = document.createElement('link');
        flatpickrCSS.rel = 'stylesheet';
        flatpickrCSS.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
        document.head.appendChild(flatpickrCSS);
      }
    }, 1);

    setupEnterKeyNavigation();
    if (step.title === 'Fabric & Button Info') {
        attachFabricFiltering();
    }
}

function formatDate(date) {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}

function saveStepData() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.name === 'Delivery Date' && input.type === 'date') {
            formData['Delivery Date'] = input.value;
        } else {
            formData[input.name] = input.value;
        }
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function setupEnterKeyNavigation() {
    const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                const next = inputs[index + 1];
                if (next) next.focus();
            }
        });
    });
}

function showOrderSummary() {
    isSummaryView = true;
    app.innerHTML = '';
    const section = document.createElement('section');
    const title = document.createElement('h2');
    title.textContent = currentLang === 'EN' ? 'Order Summary' : 'Pregled porudžbine';
    section.appendChild(title);

    const sectionGroups = {
        'Client & Order Info': ['Client Name', 'Contact Info', 'Order ID', 'Ordered Quantity', 'Order Date', 'Delivery Date'],
        'Fabric & Button Info': ['Fabric Supplier', 'Fabric Code', 'Fabric Color', 'Fabric Description', 'Fabric Consumption per Shirt', 'Button Supplier', 'Button Article', 'Button Color'],
        'Shirt Line & Model Info': ['Shirt Line', 'Pattern', 'Collar Style', 'Cuff Style', 'Placket Style', 'Monogram', 'Monogram Text', 'Monogram Placement', 'Monogram Color'],
        'Measurements': ['Neck (cm)', 'Chest (cm)', 'Waist (cm)', 'Hips (cm)', 'Shoulder Width (cm)', 'Across Shoulder', 'Back Width', 'Sleeve Length (cm)', 'Bicep (cm)', 'Under Elbow', 'Wrist (cm) Left', 'Wrist (cm) Right', 'Shirt Length (cm)'],
        'Order Notes': ['Order Notes']
    };

    for (const [group, fields] of Object.entries(sectionGroups)) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'print-section';

        const header = document.createElement('h3');
        header.textContent = translations[currentLang][group] || group;
        groupDiv.appendChild(header);

        fields.forEach(field => {
            if (formData[field]) {
                let val = formData[field];
                if (field === 'Delivery Date' && val) {
                    const d = new Date(val);
                    val = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
                }
                const p = document.createElement('p');
                p.innerHTML = `<span class="label">${translations[currentLang][field] || field}:</span> <span class="value">${val}</span>`;
                groupDiv.appendChild(p);
            }
        });

        section.appendChild(groupDiv);
    }

    const printBtn = document.createElement('button');
    printBtn.textContent = currentLang === 'EN' ? 'Print Order' : 'Štampaj porudžbinu';
    printBtn.className = 'no-print';
    printBtn.onclick = () => window.print();
    section.appendChild(printBtn);

    const newOrderBtn = document.createElement('button');
    newOrderBtn.textContent = currentLang === 'EN' ? 'New Order' : 'Nova porudžbina';
    newOrderBtn.className = 'no-print';
    newOrderBtn.onclick = async () => {
      localStorage.setItem('nobleCutOrderCounter', ++orderCounter);
      Object.keys(formData).forEach(k => formData[k] = '');
      formData['Order ID'] = await generateOrderIDFromFirestore();
      currentStep = 0;
      isSummaryView = false;
      renderStep();
    };
    section.appendChild(newOrderBtn);

    // Duplicate Order Button
    const duplicateBtn = document.createElement('button');
    duplicateBtn.textContent = currentLang === 'EN' ? 'Duplicate Order' : 'Dupliraj Porudžbinu';
    duplicateBtn.className = 'no-print';
    duplicateBtn.onclick = async () => {
      localStorage.setItem('nobleCutOrderCounter', ++orderCounter);
      formData['Order ID'] = await generateOrderIDFromFirestore();
      formData['Order Date'] = formatDate(new Date());
      currentStep = 0;
      isSummaryView = false;
      renderStep();
    };
    section.appendChild(duplicateBtn);

    const footer = document.createElement('footer');
    const printDate = new Date();
    footer.textContent = (currentLang === 'EN' ? 'Printed on: ' : 'Štampano: ')
        + printDate.toLocaleDateString('en-GB').replace(/\//g, '.')
        + ' — Noble Cut';
    section.appendChild(footer);

    app.appendChild(section);
}

createStep(currentStep);

const fabricFieldNames = ['Fabric Supplier', 'Fabric Code', 'Fabric Color', 'Fabric Description'];
const fabricDropdowns = {};

function attachFabricFiltering() {
    fabricFieldNames.forEach(name => {
        const el = document.querySelector(`[name="${name}"]`);
        if (el) {
            fabricDropdowns[name] = el;
            el.addEventListener('change', filterFabricFields);
        }
    });
}

function filterFabricFields() {
    const filters = {};
    fabricFieldNames.forEach(name => {
        const val = fabricDropdowns[name]?.value;
        if (val) {
            filters[name] = val;
        }
    });

    if (filters['Fabric Code']) {
        const match = fabricData.find(item => item['Fabric Code'] === filters['Fabric Code']);
        if (match) {
            fabricFieldNames.forEach(name => {
                fabricDropdowns[name].value = match[name];
            });
            updateFabricDropdowns(match);
            return;
        }
    }

    updateFabricDropdowns(filters);
}

function updateFabricDropdowns(filters) {
    let filtered = fabricData;
    Object.entries(filters).forEach(([key, val]) => {
        if (val) {
            filtered = filtered.filter(item => item[key] === val);
        }
    });

    fabricFieldNames.forEach(name => {
        const select = fabricDropdowns[name];
        if (!select) return;
        const current = select.value;
        const options = [...new Set(filtered.map(row => row[name]))];
        select.innerHTML = '<option value="">-- Select --</option>';
        options.forEach(val => {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = val;
            select.appendChild(opt);
        });
        if (options.includes(current)) {
            select.value = current;
        }
    });
}

}); // End of DOMContentLoaded
