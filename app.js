// ===== DATA STORAGE =====
let data = {
    clients: [],
    appointments: [],
    services: [],
    notes: [],
    gallery: [],
    transactions: [],
    notifications: []
};

// Settings storage
let settings = {
    profile: {
        name: 'Nail Designer',
        email: 'meuemail@email.com',
        phone: '',
        photo: null
    },
    studio: {
        name: 'Nail Studio',
        slogan: 'Suas unhas em boas mãos',
        address: '',
        openTime: '09:00',
        closeTime: '19:00',
        instagram: ''
    },
    appearance: {
        themeColor: '#6c5ce7'
    }
};

// Initialize data from localStorage
function initData() {
    const savedData = localStorage.getItem('nailStudioData');
    if (savedData) {
        data = JSON.parse(savedData);
        // Ensure notifications array exists for older data
        if (!data.notifications) {
            data.notifications = [];
        }
    } else {
        // Add sample data for first use
        addSampleData();
    }
    
    // Load settings
    const savedSettings = localStorage.getItem('nailStudioSettings');
    if (savedSettings) {
        settings = JSON.parse(savedSettings);
    }
    
    updateAllViews();
    applySettings();
    updateNotifications();
}

function saveData() {
    localStorage.setItem('nailStudioData', JSON.stringify(data));
}

function saveSettings() {
    localStorage.setItem('nailStudioSettings', JSON.stringify(settings));
}

function addSampleData() {
    // Sample Services
    data.services = [
        { id: 1, name: 'Alongamento em Gel', price: 150, duration: 120, category: 'gel', description: 'Alongamento completo com gel' },
        { id: 2, name: 'Manutenção de Gel', price: 80, duration: 60, category: 'gel', description: 'Manutenção do alongamento em gel' },
        { id: 3, name: 'Alongamento Acrigel', price: 180, duration: 150, category: 'acrigel', description: 'Alongamento com acrigel' },
        { id: 4, name: 'Fibra de Vidro', price: 200, duration: 180, category: 'fibra', description: 'Alongamento com fibra de vidro' },
        { id: 5, name: 'Nail Art', price: 50, duration: 30, category: 'nail-art', description: 'Decoração artística nas unhas' },
        { id: 6, name: 'Manicure Simples', price: 35, duration: 45, category: 'manicure', description: 'Manicure tradicional' },
        { id: 7, name: 'Esmaltação em Gel', price: 60, duration: 60, category: 'gel', description: 'Esmaltação com gel' }
    ];

    // Sample Clients
    data.clients = [
        { id: 1, name: 'Maria Silva', phone: '(11) 99999-1111', email: 'maria@email.com', birthday: '1990-05-15', notes: 'Prefere cores claras', createdAt: new Date().toISOString() },
        { id: 2, name: 'Ana Santos', phone: '(11) 99999-2222', email: 'ana@email.com', birthday: '1985-08-22', notes: 'Alergia a acetona', createdAt: new Date().toISOString() },
        { id: 3, name: 'Carla Oliveira', phone: '(11) 99999-3333', email: 'carla@email.com', birthday: '1995-12-10', notes: 'Gosta de nail art elaborada', createdAt: new Date().toISOString() }
    ];

    // Sample Appointments
    const today = new Date();
    data.appointments = [
        { id: 1, clientId: 1, serviceId: 1, date: formatDate(today), time: '09:00', notes: '', status: 'scheduled' },
        { id: 2, clientId: 2, serviceId: 2, date: formatDate(today), time: '11:00', notes: 'Trazer referência', status: 'scheduled' },
        { id: 3, clientId: 3, serviceId: 5, date: formatDate(addDays(today, 1)), time: '14:00', notes: '', status: 'scheduled' }
    ];

    // Sample Notes
    data.notes = [
        { id: 1, title: 'Tendências 2024', content: 'Cores em alta: Nude rosé, Marsala, Verde esmeralda\n\nTécnicas populares:\n- French invertida\n- Degradê\n- Efeito marmorizado', color: '#f0f0ff', clientId: null, images: [], createdAt: new Date().toISOString() },
        { id: 2, title: 'Lista de Compras', content: '- Gel construtor rosa\n- Esmalte em gel cor 45\n- Primer\n- Top coat matte\n- Lixa 100/180', color: '#f5f5f5', clientId: null, images: [], createdAt: new Date().toISOString() }
    ];

    // Sample Gallery (with placeholder images)
    data.gallery = [
        { id: 1, url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400', category: 'gel', clientId: 1, description: 'Alongamento em gel nude', createdAt: new Date().toISOString() },
        { id: 2, url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400', category: 'nail-art', clientId: 2, description: 'Nail art floral', createdAt: new Date().toISOString() },
        { id: 3, url: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400', category: 'manicure', clientId: null, description: 'Esmaltação clássica', createdAt: new Date().toISOString() }
    ];

    saveData();
}

// ===== UTILITY FUNCTIONS =====
function generateId(array) {
    return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
}

function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateBR(dateStr) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

// ===== NAVIGATION =====
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = item.dataset.page;
        
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        
        // Refresh page content
        switch(pageId) {
            case 'dashboard': updateDashboard(); break;
            case 'agenda': renderCalendar(); break;
            case 'clientes': renderClients(); break;
            case 'galeria': renderGallery(); break;
            case 'servicos': renderServices(); break;
            case 'notas': renderNotes(); break;
        }
    });
});

// ===== MODAL FUNCTIONS =====
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function openNewAppointmentModal() {
    populateClientSelect('appointmentClient');
    populateServiceSelect('appointmentService');
    document.getElementById('appointmentDate').value = formatDate(new Date());
    document.getElementById('appointmentForm').reset();
    openModal('appointmentModal');
}

function openNewServiceModal() {
    document.getElementById('serviceForm').reset();
    openModal('serviceModal');
}

function openNewNoteModal() {
    populateClientSelect('noteClient');
    document.getElementById('noteForm').reset();
    document.getElementById('noteImagePreview').innerHTML = '';
    openModal('noteModal');
}

function openNewPhotoModal() {
    populateClientSelect('photoClient');
    document.getElementById('photoForm').reset();
    document.getElementById('photoPreview').innerHTML = '';
    openModal('photoModal');
}

// ===== POPULATE SELECTS =====
function populateClientSelect(selectId) {
    const select = document.getElementById(selectId);
    const currentValue = select.value;
    
    // Keep first option
    const firstOption = select.options[0];
    select.innerHTML = '';
    select.appendChild(firstOption);
    
    data.clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.name;
        select.appendChild(option);
    });
    
    select.value = currentValue;
}

function populateServiceSelect(selectId) {
    const select = document.getElementById(selectId);
    const currentValue = select.value;
    
    const firstOption = select.options[0];
    select.innerHTML = '';
    select.appendChild(firstOption);
    
    data.services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.id;
        option.textContent = `${service.name} - ${formatCurrency(service.price)}`;
        select.appendChild(option);
    });
    
    select.value = currentValue;
}

// ===== SAVE FUNCTIONS =====
function saveAppointment(e) {
    e.preventDefault();
    
    const appointment = {
        id: generateId(data.appointments),
        clientId: parseInt(document.getElementById('appointmentClient').value),
        serviceId: parseInt(document.getElementById('appointmentService').value),
        date: document.getElementById('appointmentDate').value,
        time: document.getElementById('appointmentTime').value,
        notes: document.getElementById('appointmentNotes').value,
        status: 'scheduled'
    };
    
    const client = data.clients.find(c => c.id === appointment.clientId);
    const service = data.services.find(s => s.id === appointment.serviceId);
    
    data.appointments.push(appointment);
    saveData();
    
    // Add notification
    addNotification(
        'appointment',
        `Novo agendamento: ${client ? client.name : 'Cliente'} - ${service ? service.name : 'Serviço'}`,
        { appointmentId: appointment.id, date: appointment.date, time: appointment.time }
    );
    
    closeModal('appointmentModal');
    showToast('Agendamento criado com sucesso!');
    updateAllViews();
    
    // Mostrar opção de adicionar ao calendário
    showCalendarOptions(appointment);
}

function saveClient(e) {
    e.preventDefault();
    
    const clientData = {
        name: document.getElementById('clientName').value,
        phone: document.getElementById('clientPhone').value,
        email: document.getElementById('clientEmail').value,
        birthday: document.getElementById('clientBirthday').value,
        notes: document.getElementById('clientNotes').value
    };
    
    if (editingClientId) {
        // Editando cliente existente
        const index = data.clients.findIndex(c => c.id === editingClientId);
        if (index !== -1) {
            data.clients[index] = { 
                ...data.clients[index], 
                ...clientData 
            };
            
            // Add notification for edit
            addNotification(
                'client',
                `Cliente atualizada: ${clientData.name}`,
                { clientId: editingClientId }
            );
        }
        showToast('Cliente atualizada com sucesso!');
        editingClientId = null;
    } else {
        // Nova cliente
        const client = {
            ...clientData,
            id: generateId(data.clients),
            createdAt: new Date().toISOString()
        };
        
        data.clients.push(client);
        
        // Add notification for new client
        addNotification(
            'client',
            `Nova cliente cadastrada: ${client.name}`,
            { clientId: client.id }
        );
        
        showToast('Cliente cadastrada com sucesso!');
    }
    
    saveData();
    closeModal('clientModal');
    renderClients();
    updateAllViews();
}

function saveService(e) {
    e.preventDefault();
    
    const serviceData = {
        name: document.getElementById('serviceName').value,
        price: parseFloat(document.getElementById('servicePrice').value),
        duration: parseInt(document.getElementById('serviceDuration').value),
        category: document.getElementById('serviceCategory').value,
        description: document.getElementById('serviceDescription').value
    };
    
    if (editingServiceId) {
        // Editando serviço existente
        const index = data.services.findIndex(s => s.id === editingServiceId);
        if (index !== -1) {
            data.services[index] = { ...data.services[index], ...serviceData };
            
            // Add notification for edit
            addNotification(
                'service',
                `Serviço atualizado: ${serviceData.name}`,
                { serviceId: editingServiceId }
            );
        }
        showToast('Serviço atualizado com sucesso!');
        editingServiceId = null;
    } else {
        // Novo serviço
        serviceData.id = generateId(data.services);
        data.services.push(serviceData);
        
        // Add notification for new service
        addNotification(
            'service',
            `Novo serviço cadastrado: ${serviceData.name}`,
            { serviceId: serviceData.id }
        );
        
        showToast('Serviço cadastrado com sucesso!');
    }
    
    saveData();
    closeModal('serviceModal');
    renderServices();
}

function saveNote(e) {
    e.preventDefault();
    
    const images = [];
    const previews = document.querySelectorAll('#noteImagePreview img');
    previews.forEach(img => images.push(img.src));
    
    const note = {
        id: generateId(data.notes),
        title: document.getElementById('noteTitle').value,
        content: document.getElementById('noteContent').value,
        color: document.querySelector('input[name="noteColor"]:checked').value,
        clientId: document.getElementById('noteClient').value ? parseInt(document.getElementById('noteClient').value) : null,
        images: images,
        createdAt: new Date().toISOString()
    };
    
    data.notes.push(note);
    saveData();
    
    // Add notification
    addNotification(
        'note',
        `Nova nota criada: ${note.title}`,
        { noteId: note.id }
    );
    
    closeModal('noteModal');
    showToast('Nota criada com sucesso!');
    renderNotes();
}

function savePhoto(e) {
    e.preventDefault();
    
    const preview = document.querySelector('#photoPreview img');
    if (!preview) {
        showToast('Selecione uma foto!');
        return;
    }
    
    const photo = {
        id: generateId(data.gallery),
        url: preview.src,
        category: document.getElementById('photoCategory').value,
        clientId: document.getElementById('photoClient').value ? parseInt(document.getElementById('photoClient').value) : null,
        description: document.getElementById('photoDescription').value,
        createdAt: new Date().toISOString()
    };
    
    data.gallery.push(photo);
    saveData();
    
    // Add notification
    const categoryNames = {
        'gel': 'Gel',
        'acrigel': 'Acrigel',
        'fibra': 'Fibra de Vidro',
        'nail-art': 'Nail Art',
        'manicure': 'Manicure'
    };
    addNotification(
        'photo',
        `Nova foto adicionada: ${categoryNames[photo.category] || photo.category}`,
        { photoId: photo.id }
    );
    
    closeModal('photoModal');
    showToast('Foto adicionada à galeria!');
    renderGallery();
}

// ===== IMAGE PREVIEW =====
function previewNoteImages(e) {
    const files = e.target.files;
    const preview = document.getElementById('noteImagePreview');
    
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

function previewPhoto(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('photoPreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

// ===== DASHBOARD =====
function updateDashboard() {
    const today = formatDate(new Date());
    
    // Today's appointments
    const todayAppointments = data.appointments.filter(a => a.date === today && a.status !== 'completed');
    document.getElementById('todayAppointments').textContent = todayAppointments.length;
    
    // Total clients
    document.getElementById('totalClients').textContent = data.clients.length;
    
    // Month revenue
    const currentMonth = new Date().getMonth();
    const monthTransactions = data.transactions.filter(t => new Date(t.date).getMonth() === currentMonth);
    const monthRevenue = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
    document.getElementById('monthRevenue').textContent = formatCurrency(monthRevenue);
    
    // Completed services
    const completedServices = data.appointments.filter(a => a.status === 'completed').length;
    document.getElementById('completedServices').textContent = completedServices;
    
    // Upcoming appointments
    renderUpcomingAppointments();
    
    // Recent notes
    renderRecentNotes();
    
    // Load trends
    loadTrends();
}

function renderUpcomingAppointments() {
    const list = document.getElementById('upcomingAppointmentsList');
    const today = formatDate(new Date());
    
    const upcoming = data.appointments
        .filter(a => a.date >= today && a.status === 'scheduled')
        .sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.time.localeCompare(b.time);
        })
        .slice(0, 5);
    
    if (upcoming.length === 0) {
        list.innerHTML = '<p class="empty-message">Nenhum agendamento próximo</p>';
        return;
    }
    
    list.innerHTML = upcoming.map(apt => {
        const client = data.clients.find(c => c.id === apt.clientId);
        const service = data.services.find(s => s.id === apt.serviceId);
        
        return `
            <div class="appointment-item">
                <div class="appointment-time">
                    <span>${formatDateBR(apt.date)}</span>
                    <strong>${apt.time}</strong>
                </div>
                <div class="appointment-info">
                    <h4>${client ? client.name : 'Cliente não encontrado'}</h4>
                    <p>${service ? service.name : 'Serviço não encontrado'}</p>
                </div>
                <div class="appointment-actions">
                    <button class="btn-calendar-small" onclick="addExistingToCalendar(${apt.id})" title="Adicionar ao Calendário">
                        <i class="fas fa-calendar-plus"></i>
                    </button>
                    <button class="btn-complete" onclick="completeAppointment(${apt.id})" title="Concluir">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteAppointment(${apt.id})" title="Cancelar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function renderRecentNotes() {
    const list = document.getElementById('recentNotesList');
    
    const recent = [...data.notes]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
    
    if (recent.length === 0) {
        list.innerHTML = '<p class="empty-message">Nenhuma nota criada</p>';
        return;
    }
    
    list.innerHTML = recent.map(note => `
        <div class="note-item" style="background: ${note.color};" onclick="viewNote(${note.id})">
            <h4>${note.title}</h4>
            <p>${note.content}</p>
            <span class="note-date">${new Date(note.createdAt).toLocaleDateString('pt-BR')}</span>
        </div>
    `).join('');
}

// ===== CALENDAR =====
let currentDate = new Date();
let selectedDate = null;

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    document.getElementById('currentMonth').textContent = 
        new Date(year, month).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    const container = document.getElementById('calendarDays');
    container.innerHTML = '';
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        const div = createDayElement(day, month - 1, year, true);
        container.appendChild(div);
    }
    
    // Current month days
    const today = new Date();
    for (let day = 1; day <= totalDays; day++) {
        const dateStr = formatDate(new Date(year, month, day));
        const isToday = dateStr === formatDate(today);
        const isSelected = selectedDate === dateStr;
        const hasAppointments = data.appointments.some(a => a.date === dateStr);
        
        const div = createDayElement(day, month, year, false, isToday, isSelected, hasAppointments);
        container.appendChild(div);
    }
    
    // Next month days
    const remainingDays = 42 - container.children.length;
    for (let day = 1; day <= remainingDays; day++) {
        const div = createDayElement(day, month + 1, year, true);
        container.appendChild(div);
    }
}

function createDayElement(day, month, year, isOtherMonth, isToday = false, isSelected = false, hasAppointments = false) {
    const div = document.createElement('div');
    div.className = 'calendar-day';
    if (isOtherMonth) div.classList.add('other-month');
    if (isToday) div.classList.add('today');
    if (isSelected) div.classList.add('selected');
    
    div.innerHTML = `
        <span class="day-number">${day}</span>
        ${hasAppointments ? '<span class="has-appointments"></span>' : ''}
    `;
    
    if (!isOtherMonth) {
        div.addEventListener('click', () => {
            selectedDate = formatDate(new Date(year, month, day));
            renderCalendar();
            showDayAppointments(selectedDate);
        });
    }
    
    return div;
}

function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    renderCalendar();
}

function showDayAppointments(dateStr) {
    document.getElementById('selectedDate').textContent = formatDateBR(dateStr);
    
    const dayAppointments = data.appointments
        .filter(a => a.date === dateStr)
        .sort((a, b) => a.time.localeCompare(b.time));
    
    const list = document.getElementById('dayAppointmentsList');
    
    if (dayAppointments.length === 0) {
        list.innerHTML = '<p class="empty-message">Nenhum agendamento para esta data</p>';
        return;
    }
    
    list.innerHTML = dayAppointments.map(apt => {
        const client = data.clients.find(c => c.id === apt.clientId);
        const service = data.services.find(s => s.id === apt.serviceId);
        const statusClass = apt.status === 'completed' ? 'btn-success' : '';
        
        return `
            <div class="appointment-item">
                <div class="appointment-time">
                    <strong>${apt.time}</strong>
                </div>
                <div class="appointment-info">
                    <h4>${client ? client.name : 'Cliente não encontrado'}</h4>
                    <p>${service ? service.name : 'Serviço não encontrado'}</p>
                    ${apt.notes ? `<p><small>${apt.notes}</small></p>` : ''}
                </div>
                <div class="appointment-actions">
                    <button class="btn-calendar-small" onclick="addExistingToCalendar(${apt.id})" title="Adicionar ao Calendário">
                        <i class="fas fa-calendar-plus"></i>
                    </button>
                    ${apt.status !== 'completed' ? `
                        <button class="btn-complete" onclick="completeAppointment(${apt.id})" title="Concluir">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : '<span style="color: #4caf50;"><i class="fas fa-check-circle"></i></span>'}
                    <button class="btn-delete" onclick="deleteAppointment(${apt.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ===== APPOINTMENT ACTIONS =====
function completeAppointment(id) {
    const apt = data.appointments.find(a => a.id === id);
    if (apt) {
        apt.status = 'completed';
        
        // Create transaction
        const service = data.services.find(s => s.id === apt.serviceId);
        const client = data.clients.find(c => c.id === apt.clientId);
        
        if (service) {
            data.transactions.push({
                id: generateId(data.transactions),
                appointmentId: apt.id,
                clientId: apt.clientId,
                serviceId: apt.serviceId,
                amount: service.price,
                date: new Date().toISOString(),
                description: `${service.name} - ${client ? client.name : 'Cliente'}`
            });
        }
        
        saveData();
        showToast('Atendimento concluído!');
        updateAllViews();
    }
}

function deleteAppointment(id) {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
        data.appointments = data.appointments.filter(a => a.id !== id);
        saveData();
        showToast('Agendamento cancelado');
        updateAllViews();
    }
}

// ===== CLIENTS =====
let editingClientId = null;

function renderClients() {
    const grid = document.getElementById('clientsGrid');
    
    if (data.clients.length === 0) {
        grid.innerHTML = '<p class="empty-message">Nenhum cliente cadastrado</p>';
        return;
    }
    
    grid.innerHTML = data.clients.map(client => {
        const appointments = data.appointments.filter(a => a.clientId === client.id);
        const completedCount = appointments.filter(a => a.status === 'completed').length;
        
        return `
            <div class="client-card">
                <div class="client-card-header" onclick="showClientDetail(${client.id})">
                    <div class="client-avatar">${getInitials(client.name)}</div>
                    <div>
                        <h3>${client.name}</h3>
                        <p>${completedCount} atendimentos</p>
                    </div>
                </div>
                <div class="client-card-info" onclick="showClientDetail(${client.id})">
                    <span><i class="fas fa-phone"></i> ${client.phone}</span>
                    ${client.email ? `<span><i class="fas fa-envelope"></i> ${client.email}</span>` : ''}
                    ${client.birthday ? `<span><i class="fas fa-birthday-cake"></i> ${formatDateBR(client.birthday)}</span>` : ''}
                </div>
                <div class="client-card-footer">
                    <span>Cliente desde ${new Date(client.createdAt).toLocaleDateString('pt-BR')}</span>
                    <div class="client-actions">
                        <button class="btn-edit-client" onclick="event.stopPropagation(); editClient(${client.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete-client" onclick="event.stopPropagation(); deleteClient(${client.id})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function editClient(id) {
    const client = data.clients.find(c => c.id === id);
    if (!client) return;
    
    editingClientId = id;
    
    // Preencher o formulário com os dados do cliente
    document.getElementById('clientName').value = client.name;
    document.getElementById('clientPhone').value = client.phone;
    document.getElementById('clientEmail').value = client.email || '';
    document.getElementById('clientBirthday').value = client.birthday || '';
    document.getElementById('clientNotes').value = client.notes || '';
    
    // Atualizar título do modal
    const modalTitle = document.querySelector('#clientModal .modal-header h2');
    modalTitle.innerHTML = '<i class="fas fa-user-edit"></i> Editar Cliente';
    
    openModal('clientModal');
}

function deleteClient(id) {
    const client = data.clients.find(c => c.id === id);
    if (!client) return;
    
    if (confirm(`Deseja realmente excluir a cliente "${client.name}"?\n\nIsso também excluirá todos os agendamentos, notas e fotos relacionados a ela.`)) {
        // Remover cliente
        data.clients = data.clients.filter(c => c.id !== id);
        
        // Remover agendamentos do cliente
        data.appointments = data.appointments.filter(a => a.clientId !== id);
        
        // Remover notas do cliente
        data.notes = data.notes.filter(n => n.clientId !== id);
        
        // Remover fotos do cliente
        data.gallery = data.gallery.filter(g => g.clientId !== id);
        
        saveData();
        
        addNotification('client', `Cliente excluída: ${client.name}`, { clientId: id });
        showToast('Cliente excluída com sucesso!');
        renderClients();
        updateAllViews();
    }
}

function openNewClientModal() {
    editingClientId = null;
    document.getElementById('clientForm').reset();
    
    // Restaurar título do modal
    const modalTitle = document.querySelector('#clientModal .modal-header h2');
    modalTitle.innerHTML = '<i class="fas fa-user-plus"></i> Nova Cliente';
    
    openModal('clientModal');
}

function showClientDetail(id) {
    const client = data.clients.find(c => c.id === id);
    if (!client) return;
    
    document.getElementById('clientDetailName').textContent = client.name;
    
    // Client Info
    document.getElementById('clientDetailInfo').innerHTML = `
        <p><strong>Telefone:</strong> ${client.phone}</p>
        <p><strong>E-mail:</strong> ${client.email || 'Não informado'}</p>
        <p><strong>Aniversário:</strong> ${client.birthday ? formatDateBR(client.birthday) : 'Não informado'}</p>
        <p><strong>Observações:</strong> ${client.notes || 'Nenhuma'}</p>
    `;
    
    // Client History
    const appointments = data.appointments
        .filter(a => a.clientId === id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    document.getElementById('clientHistory').innerHTML = appointments.length > 0 
        ? appointments.map(apt => {
            const service = data.services.find(s => s.id === apt.serviceId);
            return `
                <div class="appointment-item" style="margin-bottom: 10px;">
                    <div class="appointment-time">
                        <span>${formatDateBR(apt.date)}</span>
                        <strong>${apt.time}</strong>
                    </div>
                    <div class="appointment-info">
                        <h4>${service ? service.name : 'Serviço'}</h4>
                        <p>${apt.status === 'completed' ? '✓ Concluído' : 'Agendado'}</p>
                    </div>
                </div>
            `;
        }).join('')
        : '<p class="empty-message">Nenhum atendimento registrado</p>';
    
    // Client Notes
    const clientNotes = data.notes.filter(n => n.clientId === id);
    document.getElementById('clientNotes').innerHTML = clientNotes.length > 0
        ? clientNotes.map(note => `
            <div class="note-item" style="background: ${note.color}; margin-bottom: 10px;">
                <h4>${note.title}</h4>
                <p>${note.content}</p>
            </div>
        `).join('')
        : '<p class="empty-message">Nenhuma nota para este cliente</p>';
    
    // Client Gallery
    const clientPhotos = data.gallery.filter(g => g.clientId === id);
    document.getElementById('clientGallery').innerHTML = clientPhotos.length > 0
        ? `<div class="gallery-grid">${clientPhotos.map(photo => `
            <div class="gallery-item">
                <img src="${photo.url}" alt="${photo.description}">
            </div>
        `).join('')}</div>`
        : '<p class="empty-message">Nenhuma foto deste cliente</p>';
    
    openModal('clientDetailModal');
}

// ===== SERVICES =====
function renderServices() {
    const list = document.getElementById('servicesList');
    
    if (data.services.length === 0) {
        list.innerHTML = '<p class="empty-message">Nenhum serviço cadastrado</p>';
        return;
    }
    
    list.innerHTML = data.services.map(service => `
        <div class="service-card">
            <div class="service-info">
                <h3>${service.name}</h3>
                <p>${service.description || 'Sem descrição'}</p>
                <div class="service-meta">
                    <span><i class="fas fa-clock"></i> ${service.duration} min</span>
                    <span><i class="fas fa-tag"></i> ${getCategoryName(service.category)}</span>
                </div>
                <div class="service-actions">
                    <button onclick="editService(${service.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteService(${service.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="service-price">${formatCurrency(service.price)}</div>
        </div>
    `).join('');
}

function getCategoryName(category) {
    const categories = {
        'gel': 'Gel',
        'acrigel': 'Acrigel',
        'fibra': 'Fibra de Vidro',
        'nail-art': 'Nail Art',
        'manicure': 'Manicure',
        'pedicure': 'Pedicure'
    };
    return categories[category] || category;
}

function deleteService(id) {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
        data.services = data.services.filter(s => s.id !== id);
        saveData();
        showToast('Serviço excluído');
        renderServices();
    }
}

// Variável para controlar edição de serviço
let editingServiceId = null;

function editService(id) {
    const service = data.services.find(s => s.id === id);
    if (!service) return;
    
    editingServiceId = id;
    
    document.getElementById('serviceName').value = service.name;
    document.getElementById('servicePrice').value = service.price;
    document.getElementById('serviceDuration').value = service.duration;
    document.getElementById('serviceCategory').value = service.category;
    document.getElementById('serviceDescription').value = service.description || '';
    
    // Mudar título do modal
    document.querySelector('#serviceModal .modal-header h2').innerHTML = '<i class="fas fa-edit"></i> Editar Serviço';
    
    openModal('serviceModal');
}

function openNewServiceModal() {
    editingServiceId = null;
    document.getElementById('serviceForm').reset();
    document.querySelector('#serviceModal .modal-header h2').innerHTML = '<i class="fas fa-spa"></i> Novo Serviço';
    openModal('serviceModal');
}

// ===== GALLERY =====
function renderGallery(filter = 'all') {
    const grid = document.getElementById('galleryGrid');
    
    let photos = data.gallery;
    if (filter !== 'all') {
        photos = photos.filter(p => p.category === filter);
    }
    
    if (photos.length === 0) {
        grid.innerHTML = '<p class="empty-message">Nenhuma foto na galeria</p>';
        return;
    }
    
    grid.innerHTML = photos.map(photo => {
        const client = photo.clientId ? data.clients.find(c => c.id === photo.clientId) : null;
        
        return `
            <div class="gallery-item">
                <img src="${photo.url}" alt="${photo.description}" onerror="this.src='https://via.placeholder.com/400x300?text=Imagem'">
                <div class="gallery-item-info">
                    <h4>${photo.description || 'Sem descrição'}</h4>
                    <p>${client ? client.name : 'Trabalho pessoal'}</p>
                    <span class="category-tag">${getCategoryName(photo.category)}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Gallery Filters
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderGallery(btn.dataset.filter);
    });
});

// ===== NOTES =====
function renderNotes() {
    const grid = document.getElementById('notesGrid');
    
    if (data.notes.length === 0) {
        grid.innerHTML = '<p class="empty-message">Nenhuma nota criada</p>';
        return;
    }
    
    grid.innerHTML = data.notes.map(note => {
        const client = note.clientId ? data.clients.find(c => c.id === note.clientId) : null;
        
        return `
            <div class="note-card" style="background: ${note.color};" onclick="viewNote(${note.id})">
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                ${note.images.length > 0 ? `
                    <div class="note-images">
                        ${note.images.slice(0, 3).map(img => `<img src="${img}" alt="Anexo">`).join('')}
                        ${note.images.length > 3 ? `<span>+${note.images.length - 3}</span>` : ''}
                    </div>
                ` : ''}
                <div class="note-card-footer">
                    <span>${client ? client.name : 'Nota geral'} • ${new Date(note.createdAt).toLocaleDateString('pt-BR')}</span>
                    <div class="note-actions">
                        <button onclick="event.stopPropagation(); deleteNote(${note.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function viewNote(id) {
    const note = data.notes.find(n => n.id === id);
    if (!note) return;
    
    document.getElementById('viewNoteTitle').innerHTML = `<i class="fas fa-sticky-note" style="color: var(--primary-color);"></i> ${note.title}`;
    
    let content = `<p>${note.content}</p>`;
    
    if (note.images.length > 0) {
        content += `
            <div class="note-images">
                ${note.images.map(img => `<img src="${img}" alt="Anexo" onclick="window.open('${img}', '_blank')">`).join('')}
            </div>
        `;
    }
    
    document.getElementById('viewNoteContent').innerHTML = content;
    openModal('viewNoteModal');
}

function deleteNote(id) {
    if (confirm('Tem certeza que deseja excluir esta nota?')) {
        data.notes = data.notes.filter(n => n.id !== id);
        saveData();
        showToast('Nota excluída');
        renderNotes();
        renderRecentNotes();
    }
}

// ===== FINANCIAL =====
function updateFinancial() {
    // Total revenue
    const totalRevenue = data.transactions.reduce((sum, t) => sum + t.amount, 0);
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
    
    // Monthly revenue
    const currentMonth = new Date().getMonth();
    const monthTransactions = data.transactions.filter(t => new Date(t.date).getMonth() === currentMonth);
    const monthlyRevenue = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
    document.getElementById('monthlyRevenue').textContent = formatCurrency(monthlyRevenue);
    
    // Average ticket
    const avgTicket = data.transactions.length > 0 ? totalRevenue / data.transactions.length : 0;
    document.getElementById('avgTicket').textContent = formatCurrency(avgTicket);
    
    // Transactions list
    renderTransactions();
}

function renderTransactions() {
    const list = document.getElementById('transactionsList');
    
    const transactions = [...data.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (transactions.length === 0) {
        list.innerHTML = '<p class="empty-message">Nenhuma transação registrada</p>';
        return;
    }
    
    list.innerHTML = transactions.map(t => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-icon">
                    <i class="fas fa-hand-sparkles"></i>
                </div>
                <div class="transaction-details">
                    <h4>${t.description}</h4>
                    <p>${new Date(t.date).toLocaleDateString('pt-BR')}</p>
                </div>
            </div>
            <span class="transaction-amount">+ ${formatCurrency(t.amount)}</span>
        </div>
    `).join('');
}

// ===== SEARCH =====
document.getElementById('searchInput').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    
    if (query.length < 2) return;
    
    // Search in clients
    const foundClients = data.clients.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.phone.includes(query)
    );
    
    if (foundClients.length > 0) {
        // Navigate to clients page and highlight
        document.querySelector('[data-page="clientes"]').click();
    }
});

// ===== TOAST =====
function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== UPDATE ALL VIEWS =====
function updateAllViews() {
    updateDashboard();
    renderCalendar();
    renderClients();
    renderGallery();
    renderServices();
    renderNotes();
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    initData();
    renderCalendar();
});

// Close modal on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// ===== CALENDAR INTEGRATION =====
function showCalendarOptions(appointment) {
    const client = data.clients.find(c => c.id === appointment.clientId);
    const service = data.services.find(s => s.id === appointment.serviceId);
    
    if (!client || !service) return;
    
    // Criar modal de opções de calendário
    const existingModal = document.getElementById('calendarOptionsModal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'calendarOptionsModal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h2><i class="fas fa-calendar-plus"></i> Adicionar ao Calendário</h2>
                <button class="btn-close" onclick="closeModal('calendarOptionsModal')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div style="padding: 25px;">
                <p style="margin-bottom: 20px; color: var(--text-secondary);">Deseja adicionar este agendamento ao seu calendário?</p>
                <div class="calendar-options">
                    <button class="btn-calendar google" onclick="addToGoogleCalendar(${appointment.id})">
                        <i class="fab fa-google"></i>
                        Google Calendar
                    </button>
                    <button class="btn-calendar apple" onclick="downloadICS(${appointment.id})">
                        <i class="fab fa-apple"></i>
                        Apple Calendar / Outlook
                    </button>
                </div>
                <button class="btn-secondary" style="width: 100%; margin-top: 15px;" onclick="closeModal('calendarOptionsModal')">
                    Pular
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fechar ao clicar fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal('calendarOptionsModal');
    });
}

function addToGoogleCalendar(appointmentId) {
    const appointment = data.appointments.find(a => a.id === appointmentId);
    if (!appointment) return;
    
    const client = data.clients.find(c => c.id === appointment.clientId);
    const service = data.services.find(s => s.id === appointment.serviceId);
    
    if (!client || !service) return;
    
    // Criar data de início e fim
    const startDateTime = new Date(`${appointment.date}T${appointment.time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + (service.duration * 60000));
    
    // Formatar para Google Calendar (YYYYMMDDTHHmmss)
    const formatGoogleDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };
    
    const title = encodeURIComponent(`💅 ${client.name} - ${service.name}`);
    const details = encodeURIComponent(`Cliente: ${client.name}\nTelefone: ${client.phone}\nServiço: ${service.name}\nValor: ${formatCurrency(service.price)}\n\nObservações: ${appointment.notes || 'Nenhuma'}`);
    const dates = `${formatGoogleDate(startDateTime)}/${formatGoogleDate(endDateTime)}`;
    
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}`;
    
    window.open(googleUrl, '_blank');
    closeModal('calendarOptionsModal');
    showToast('Abrindo Google Calendar...');
}

function downloadICS(appointmentId) {
    const appointment = data.appointments.find(a => a.id === appointmentId);
    if (!appointment) return;
    
    const client = data.clients.find(c => c.id === appointment.clientId);
    const service = data.services.find(s => s.id === appointment.serviceId);
    
    if (!client || !service) return;
    
    // Criar data de início e fim
    const startDateTime = new Date(`${appointment.date}T${appointment.time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + (service.duration * 60000));
    
    // Formatar para ICS (YYYYMMDDTHHmmss)
    const formatICSDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '').slice(0, -1);
    };
    
    const uid = `nail-studio-${appointmentId}-${Date.now()}@nailstudio`;
    const now = formatICSDate(new Date());
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Nail Studio//Agendamento//PT
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${now}
DTSTART:${formatICSDate(startDateTime)}
DTEND:${formatICSDate(endDateTime)}
SUMMARY:💅 ${client.name} - ${service.name}
DESCRIPTION:Cliente: ${client.name}\nTelefone: ${client.phone}\nServiço: ${service.name}\nValor: ${formatCurrency(service.price)}\nObservações: ${appointment.notes || 'Nenhuma'}
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Lembrete: Atendimento em 1 hora
TRIGGER:-PT1H
END:VALARM
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Lembrete: Atendimento em 30 minutos
TRIGGER:-PT30M
END:VALARM
END:VEVENT
END:VCALENDAR`;
    
    // Criar e baixar arquivo
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `agendamento-${client.name.replace(/\s+/g, '-')}-${appointment.date}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    
    closeModal('calendarOptionsModal');
    showToast('Arquivo de calendário baixado!');
}

// Função para adicionar agendamento existente ao calendário
function addExistingToCalendar(appointmentId) {
    const appointment = data.appointments.find(a => a.id === appointmentId);
    if (appointment) {
        showCalendarOptions(appointment);
    }
}

// ===== PROFILE DROPDOWN =====
function toggleProfileDropdown() {
    const container = document.querySelector('.user-profile-container');
    container.classList.toggle('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const container = document.querySelector('.user-profile-container');
    if (container && !container.contains(e.target)) {
        container.classList.remove('active');
    }
});

// ===== SETTINGS MODALS =====
function openProfileSettingsModal() {
    document.querySelector('.user-profile-container').classList.remove('active');
    
    // Preencher formulário com dados atuais
    document.getElementById('profileName').value = settings.profile.name;
    document.getElementById('profileEmail').value = settings.profile.email;
    document.getElementById('profilePhone').value = settings.profile.phone;
    
    if (settings.profile.photo) {
        document.getElementById('profilePhotoPreview').src = settings.profile.photo;
    }
    
    openModal('profileSettingsModal');
}

function openStudioSettingsModal() {
    document.querySelector('.user-profile-container').classList.remove('active');
    
    document.getElementById('studioName').value = settings.studio.name;
    document.getElementById('studioSlogan').value = settings.studio.slogan;
    document.getElementById('studioAddress').value = settings.studio.address;
    document.getElementById('studioOpenTime').value = settings.studio.openTime;
    document.getElementById('studioCloseTime').value = settings.studio.closeTime;
    document.getElementById('studioInstagram').value = settings.studio.instagram;
    
    openModal('studioSettingsModal');
}

function openAppearanceModal() {
    document.querySelector('.user-profile-container').classList.remove('active');
    
    // Selecionar cor atual
    const currentColor = settings.appearance.themeColor;
    const colorInput = document.querySelector(`input[name="themeColor"][value="${currentColor}"]`);
    if (colorInput) colorInput.checked = true;
    
    openModal('appearanceModal');
}

// ===== SAVE SETTINGS =====
function saveProfileSettings(e) {
    e.preventDefault();
    
    settings.profile.name = document.getElementById('profileName').value;
    settings.profile.email = document.getElementById('profileEmail').value;
    settings.profile.phone = document.getElementById('profilePhone').value;
    
    const photoPreview = document.getElementById('profilePhotoPreview');
    if (photoPreview.src && !photoPreview.src.includes('ui-avatars.com')) {
        settings.profile.photo = photoPreview.src;
    }
    
    saveSettings();
    applySettings();
    closeModal('profileSettingsModal');
    showToast('Perfil atualizado com sucesso!');
}

function saveStudioSettings(e) {
    e.preventDefault();
    
    settings.studio.name = document.getElementById('studioName').value;
    settings.studio.slogan = document.getElementById('studioSlogan').value;
    settings.studio.address = document.getElementById('studioAddress').value;
    settings.studio.openTime = document.getElementById('studioOpenTime').value;
    settings.studio.closeTime = document.getElementById('studioCloseTime').value;
    settings.studio.instagram = document.getElementById('studioInstagram').value;
    
    saveSettings();
    applySettings();
    closeModal('studioSettingsModal');
    showToast('Configurações do estúdio salvas!');
}

function saveAppearance(e) {
    e.preventDefault();
    
    const selectedColor = document.querySelector('input[name="themeColor"]:checked').value;
    settings.appearance.themeColor = selectedColor;
    
    saveSettings();
    applyThemeColor(selectedColor);
    closeModal('appearanceModal');
    showToast('Tema atualizado!');
}

// ===== APPLY SETTINGS =====
function applySettings() {
    // Aplicar nome e foto do perfil
    const profileImg = settings.profile.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(settings.profile.name)}&background=${settings.appearance.themeColor.replace('#', '')}&color=fff`;
    
    document.getElementById('headerProfileImg').src = profileImg;
    document.getElementById('headerProfileName').textContent = settings.profile.name;
    document.getElementById('dropdownProfileImg').src = profileImg;
    document.getElementById('dropdownProfileName').textContent = settings.profile.name;
    document.getElementById('dropdownProfileEmail').textContent = settings.profile.email;
    
    // Aplicar nome do estúdio no logo
    const logoText = document.querySelector('.logo span');
    if (logoText) logoText.textContent = settings.studio.name;
    
    // Aplicar cor do tema
    applyThemeColor(settings.appearance.themeColor);
}

function applyThemeColor(color) {
    const root = document.documentElement;
    
    // Cor principal
    root.style.setProperty('--primary-color', color);
    
    // Calcular RGB da cor para usar em rgba()
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    root.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
    
    // Calcular cor mais clara
    const lighterColor = lightenColor(color, 30);
    root.style.setProperty('--primary-light', lighterColor);
    
    // Calcular cor mais escura
    const darkerColor = darkenColor(color, 15);
    root.style.setProperty('--primary-dark', darkerColor);
    
    // Cor secundária (variação)
    const secondaryColor = lightenColor(color, 15);
    root.style.setProperty('--secondary-color', secondaryColor);
    
    // Atualizar sidebar com a cor do tema
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.style.background = `linear-gradient(180deg, ${darkenColor(color, 40)} 0%, ${darkenColor(color, 30)} 100%)`;
    }
    
    // Atualizar ícone do logo
    const logoIcon = document.querySelector('.logo i');
    if (logoIcon) {
        logoIcon.style.color = lighterColor;
    }
    
    // Atualizar ícones de estatísticas
    const statIcons = document.querySelectorAll('.stat-icon');
    statIcons.forEach((icon, index) => {
        const colors = [color, lighterColor, darkerColor, secondaryColor];
        icon.style.background = colors[index % colors.length];
    });
    
    // Atualizar foto do perfil com nova cor
    if (!settings.profile.photo) {
        const profileImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(settings.profile.name)}&background=${color.replace('#', '')}&color=fff`;
        const headerImg = document.getElementById('headerProfileImg');
        const dropdownImg = document.getElementById('dropdownProfileImg');
        if (headerImg) headerImg.src = profileImg;
        if (dropdownImg) dropdownImg.src = profileImg;
    }
}

function lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
}

function darkenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (
        0x1000000 +
        (R > 0 ? R : 0) * 0x10000 +
        (G > 0 ? G : 0) * 0x100 +
        (B > 0 ? B : 0)
    ).toString(16).slice(1);
}

// ===== PREVIEW PROFILE PHOTO =====
function previewProfilePhoto(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profilePhotoPreview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// ===== EXPORT DATA =====
function exportAllData() {
    document.querySelector('.user-profile-container').classList.remove('active');
    
    const exportData = {
        data: data,
        settings: settings,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `nail-studio-backup-${formatDate(new Date())}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    
    showToast('Dados exportados com sucesso!');
}

// ===== NOTIFICATIONS SYSTEM =====
function addNotification(type, message, details = {}) {
    const notification = {
        id: Date.now(),
        type: type, // 'appointment', 'client', 'service', 'note', 'photo'
        message: message,
        details: details,
        read: false,
        createdAt: new Date().toISOString()
    };
    
    data.notifications.unshift(notification);
    
    // Keep only last 50 notifications
    if (data.notifications.length > 50) {
        data.notifications = data.notifications.slice(0, 50);
    }
    
    saveData();
    updateNotifications();
}

function updateNotifications() {
    const badge = document.getElementById('notificationBadge');
    const list = document.getElementById('notificationsList');
    
    if (!badge || !list) return;
    
    const unreadCount = data.notifications.filter(n => !n.read).length;
    badge.textContent = unreadCount;
    badge.setAttribute('data-count', unreadCount);
    
    if (data.notifications.length === 0) {
        list.innerHTML = '<p class="empty-notifications">Nenhuma notificação</p>';
        return;
    }
    
    list.innerHTML = data.notifications.map(notification => {
        const iconClass = getNotificationIconClass(notification.type);
        const timeAgo = getTimeAgo(new Date(notification.createdAt));
        
        return `
            <div class="notification-item ${notification.read ? '' : 'unread'}" onclick="markAsRead(${notification.id})">
                <div class="notification-icon ${notification.type}">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div class="notification-content">
                    <p>${notification.message}</p>
                    <span>${timeAgo}</span>
                </div>
            </div>
        `;
    }).join('');
}

function getNotificationIconClass(type) {
    const icons = {
        'appointment': 'fa-calendar-check',
        'client': 'fa-user-plus',
        'service': 'fa-spa',
        'note': 'fa-sticky-note',
        'photo': 'fa-image'
    };
    return icons[type] || 'fa-bell';
}

function getTimeAgo(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Agora mesmo';
    if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} dias atrás`;
    
    return date.toLocaleDateString('pt-BR');
}

function toggleNotifications() {
    const dropdown = document.getElementById('notificationsDropdown');
    dropdown.classList.toggle('active');
    
    // Close profile dropdown if open
    document.getElementById('profileDropdown').classList.remove('active');
    document.querySelector('.user-profile-container').classList.remove('active');
}

function markAsRead(notificationId) {
    const notification = data.notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        saveData();
        updateNotifications();
    }
}

function clearAllNotifications() {
    data.notifications = [];
    saveData();
    updateNotifications();
    showToast('Notificações limpas!');
}

// Close notifications dropdown when clicking outside
document.addEventListener('click', function(e) {
    const notificationContainer = document.querySelector('.notification-container');
    const notificationsDropdown = document.getElementById('notificationsDropdown');
    
    if (notificationContainer && !notificationContainer.contains(e.target)) {
        if (notificationsDropdown) {
            notificationsDropdown.classList.remove('active');
        }
    }
});

// ===== INSPIRATIONS & TRENDS =====
// Nail inspiration images - Curadoria das melhores nail arts
const inspirationSources = [
    // Nail Arts Clássicas
    { url: 'https://i.pinimg.com/736x/8a/c4/7e/8ac47e8a5c5c3c4d8f3c3f3e5b5a5b5c.jpg', title: 'French Elegante' },
    { url: 'https://i.pinimg.com/736x/1a/2b/3c/1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d.jpg', title: 'Nude Sofisticado' },
    
    // Aura Nails - Tendência 2025
    { url: 'https://i.pinimg.com/564x/a8/5d/c3/a85dc3f8e9b2c4d5e6f7a8b9c0d1e2f3.jpg', title: 'Aura Nails Rosa' },
    { url: 'https://i.pinimg.com/564x/b7/4e/d2/b74ed2a3b4c5d6e7f8a9b0c1d2e3f4a5.jpg', title: 'Aura Lilás' },
    
    // Chrome & Glazed
    { url: 'https://i.pinimg.com/564x/c6/3d/e1/c63de1b2c3d4e5f6a7b8c9d0e1f2a3b4.jpg', title: 'Chrome Prateado' },
    { url: 'https://i.pinimg.com/564x/d5/2c/f0/d52cf0a1b2c3d4e5f6a7b8c9d0e1f2a3.jpg', title: 'Glazed Donut' },
    
    // Nail Art Elaboradas
    { url: 'https://i.pinimg.com/564x/e4/1b/a9/e41ba9f0a1b2c3d4e5f6a7b8c9d0e1f2.jpg', title: 'Nail Art Floral' },
    { url: 'https://i.pinimg.com/564x/f3/0a/b8/f30ab8e9f0a1b2c3d4e5f6a7b8c9d0e1.jpg', title: 'Butterfly Nails' },
    
    // Minimalistas
    { url: 'https://i.pinimg.com/564x/a2/9f/c7/a29fc7d8e9f0a1b2c3d4e5f6a7b8c9d0.jpg', title: 'Minimalista Chic' },
    { url: 'https://i.pinimg.com/564x/b1/8e/d6/b18ed6c7d8e9f0a1b2c3d4e5f6a7b8c9.jpg', title: 'Linhas Geométricas' },
    
    // 3D & Texturas
    { url: 'https://i.pinimg.com/564x/c0/7d/e5/c07de5b6c7d8e9f0a1b2c3d4e5f6a7b8.jpg', title: '3D Flowers' },
    { url: 'https://i.pinimg.com/564x/d9/6c/f4/d96cf4a5b6c7d8e9f0a1b2c3d4e5f6a7.jpg', title: 'Velvet Texture' },
    
    // Cores Vibrantes
    { url: 'https://i.pinimg.com/564x/e8/5b/a3/e85ba3f4a5b6c7d8e9f0a1b2c3d4e5f6.jpg', title: 'Neon Summer' },
    { url: 'https://i.pinimg.com/564x/f7/4a/b2/f74ab2e3f4a5b6c7d8e9f0a1b2c3d4e5.jpg', title: 'Rainbow Gradient' },
    
    // Elegantes
    { url: 'https://i.pinimg.com/564x/a6/39/c1/a639c1d2e3f4a5b6c7d8e9f0a1b2c3d4.jpg', title: 'Red Carpet Glam' },
    { url: 'https://i.pinimg.com/564x/b5/28/d0/b528d0c1d2e3f4a5b6c7d8e9f0a1b2c3.jpg', title: 'Rose Gold Luxury' }
];

// URLs de backup com imagens reais de nail art do Pexels
const backupNailImages = [
    'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/704815/pexels-photo-704815.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3997383/pexels-photo-3997383.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3997387/pexels-photo-3997387.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/939835/pexels-photo-939835.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1144355/pexels-photo-1144355.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3997373/pexels-photo-3997373.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3738347/pexels-photo-3738347.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3997393/pexels-photo-3997393.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3997389/pexels-photo-3997389.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/5128267/pexels-photo-5128267.jpeg?auto=compress&cs=tinysrgb&w=400'
];

// Dynamic nail trends that update based on current date/season
function getTrendsByMonth() {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    
    // Base trends sempre disponíveis
    const baseTrends = [
        {
            name: 'Aura Nails',
            description: 'Efeito de cores que se mesclam criando uma "aura" etérea nas unhas',
            icon: 'fa-palette',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            hot: true
        },
        {
            name: 'Glazed Donut',
            description: 'Acabamento perolado e brilhante inspirado no esmalte de rosquinha',
            icon: 'fa-gem',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            hot: true
        },
        {
            name: 'Chrome Effect',
            description: 'Efeito espelhado metálico em tons de prata, dourado ou rosé',
            icon: 'fa-circle',
            gradient: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
            hot: false
        }
    ];
    
    // Tendências sazonais
    const seasonalTrends = {
        // Verão (Dez-Fev no Brasil)
        summer: [
            { name: 'Neon Summer', description: 'Cores vibrantes e neon para o verão brasileiro', icon: 'fa-sun', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
            { name: 'Beach Vibes', description: 'Tons de azul oceano e areia com glitter', icon: 'fa-umbrella-beach', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
            { name: 'Tropical Fruits', description: 'Nail art com frutas tropicais e cores quentes', icon: 'fa-lemon', gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)' }
        ],
        // Outono (Mar-Mai)
        autumn: [
            { name: 'Burgundy Elegance', description: 'Tons de vinho e bordô sofisticados', icon: 'fa-wine-glass', gradient: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)' },
            { name: 'Earth Tones', description: 'Cores terrosas e naturais inspiradas no outono', icon: 'fa-leaf', gradient: 'linear-gradient(135deg, #c79081 0%, #dfa579 100%)' },
            { name: 'Velvet Finish', description: 'Acabamento aveludado e texturizado', icon: 'fa-feather', gradient: 'linear-gradient(135deg, #834d9b 0%, #d04ed6 100%)' }
        ],
        // Inverno (Jun-Ago)
        winter: [
            { name: 'Ice Chrome', description: 'Cromado gelado em tons de prata, azul e lilás metálico', icon: 'fa-snowflake', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
            { name: 'Dark Romance', description: 'Tons escuros e dramáticos com toques de vermelho', icon: 'fa-heart', gradient: 'linear-gradient(135deg, #200122 0%, #6f0000 100%)' },
            { name: 'Cozy Neutrals', description: 'Nudes quentes e aconchegantes para os dias frios', icon: 'fa-mug-hot', gradient: 'linear-gradient(135deg, #c9b18c 0%, #d4a76a 100%)' }
        ],
        // Primavera (Set-Nov)
        spring: [
            { name: 'Butter Nails', description: 'Tons cremosos e suaves de amarelo manteiga e nude rosado', icon: 'fa-spa', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
            { name: 'Soft Girl Aesthetic', description: 'Decorações delicadas com laços, corações e flores em tons pastel', icon: 'fa-heart', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
            { name: 'Cherry Blossom', description: 'Nail art inspirada nas flores de cerejeira', icon: 'fa-flower', gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)' }
        ]
    };
    
    // Tendências específicas do ano
    const yearTrends = {
        2025: [
            { name: '3D Nail Art', description: 'Decorações tridimensionais com pedras e apliques', icon: 'fa-cube', gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', hot: true },
            { name: 'Jelly Nails', description: 'Unhas translúcidas com efeito gelatinoso em cores vibrantes', icon: 'fa-water', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', hot: true },
            { name: 'Micro French', description: 'French minimalista com linha super fina', icon: 'fa-minus', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', hot: true }
        ],
        2026: [
            { name: 'Holo Dreams', description: 'Efeito holográfico iridescente que muda de cor', icon: 'fa-rainbow', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', hot: true },
            { name: 'Textured Nails', description: 'Unhas com texturas em alto relevo', icon: 'fa-layer-group', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', hot: true }
        ]
    };
    
    // Determinar estação atual (Brasil)
    let season;
    if (month >= 11 || month <= 1) season = 'summer';
    else if (month >= 2 && month <= 4) season = 'autumn';
    else if (month >= 5 && month <= 7) season = 'winter';
    else season = 'spring';
    
    // Combinar tendências
    let allTrends = [...baseTrends];
    
    if (seasonalTrends[season]) {
        allTrends = [...allTrends, ...seasonalTrends[season]];
    }
    
    if (yearTrends[year]) {
        allTrends = [...allTrends, ...yearTrends[year]];
    }
    if (yearTrends[year + 1]) {
        allTrends = [...allTrends, ...yearTrends[year + 1]];
    }
    
    return allTrends;
}

function getTrendColors() {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    
    // Cores das tendências 2025/2026
    const trendColors2025 = [
        { color: '#E8D5E0', name: 'Aura Pink' },
        { color: '#C9B8D9', name: 'Aura Lilás' },
        { color: '#F5E6D3', name: 'Glazed Nude' },
        { color: '#FFF0F5', name: 'Glazed Pearl' },
        { color: '#D4D4D4', name: 'Chrome Silver' },
        { color: '#B8A9C9', name: 'Jelly Grape' }
    ];
    
    // Cores sazonais baseadas nas tendências
    const seasonalColors = {
        // Verão (Dez-Fev) - Cores vibrantes e neon
        summer: [
            { color: '#FF6B9D', name: 'Neon Pink' },
            { color: '#00D4AA', name: 'Tropical Mint' },
            { color: '#FFB347', name: 'Mango' },
            { color: '#FF69B4', name: 'Hot Pink' },
            { color: '#87CEEB', name: 'Ocean Blue' },
            { color: '#FFDAB9', name: 'Peach' }
        ],
        // Outono (Mar-Mai) - Tons terrosos e elegantes
        autumn: [
            { color: '#8B4557', name: 'Burgundy Wine' },
            { color: '#C19A6B', name: 'Caramel Latte' },
            { color: '#A0522D', name: 'Terracota' },
            { color: '#DEB887', name: 'Nude Caramelo' },
            { color: '#CD853F', name: 'Bronze' },
            { color: '#8B0000', name: 'Dark Cherry' }
        ],
        // Inverno (Jun-Ago) - Tons frios e sofisticados
        winter: [
            { color: '#6C5B7B', name: 'Plum Frost' },
            { color: '#355C7D', name: 'Midnight Blue' },
            { color: '#8E44AD', name: 'Royal Purple' },
            { color: '#C0C0C0', name: 'Ice Silver' },
            { color: '#4A4A4A', name: 'Charcoal' },
            { color: '#B8B8D1', name: 'Lavender Ice' }
        ],
        // Primavera (Set-Nov) - Tons suaves e florais
        spring: [
            { color: '#FFB6C1', name: 'Cherry Blossom' },
            { color: '#E6E6FA', name: 'Lavender Soft' },
            { color: '#98D8C8', name: 'Mint Fresh' },
            { color: '#FFDEAD', name: 'Butter Cream' },
            { color: '#DDA0DD', name: 'Plum Blossom' },
            { color: '#F0FFF0', name: 'Honeydew' }
        ]
    };
    
    // Determinar estação atual (Brasil)
    let season;
    if (month >= 11 || month <= 1) season = 'summer';
    else if (month >= 2 && month <= 4) season = 'autumn';
    else if (month >= 5 && month <= 7) season = 'winter';
    else season = 'spring';
    
    // Combinar cores das tendências com cores sazonais
    const allColors = [...trendColors2025, ...(seasonalColors[season] || [])];
    
    // Retornar 8 cores mais relevantes
    return allColors.slice(0, 8);
}

function loadTrends() {
    const trendsGrid = document.getElementById('trendsGrid');
    const trendColors = document.getElementById('trendColors');
    
    if (!trendsGrid || !trendColors) return;
    
    const trends = getTrendsByMonth();
    const colors = getTrendColors();
    
    trendsGrid.innerHTML = trends.slice(0, 6).map(trend => `
        <div class="trend-item ${trend.hot ? 'hot-trend' : ''}">
            <div class="trend-icon" style="background: ${trend.gradient};">
                <i class="fas ${trend.icon}"></i>
            </div>
            <div class="trend-info">
                <h4>${trend.name} ${trend.hot ? '<span class="trend-hot-badge">🔥</span>' : ''}</h4>
                <p>${trend.description}</p>
            </div>
        </div>
    `).join('');
    
    trendColors.innerHTML = colors.map(c => `
        <div class="color-swatch" style="background: ${c.color};" title="${c.name}"></div>
    `).join('');
}

function loadInspirations() {
    const grid = document.getElementById('inspirationsGrid');
    if (!grid) return;
    
    // Show loading skeletons
    grid.innerHTML = Array(8).fill('<div class="inspiration-skeleton"></div>').join('');
    
    // Simulate loading then show images
    setTimeout(() => {
        // Usar imagens de backup do Pexels que são garantidas
        const shuffledBackup = [...backupNailImages].sort(() => Math.random() - 0.5);
        const shuffledTitles = [...inspirationSources].sort(() => Math.random() - 0.5);
        
        // Combinar URLs confiáveis com títulos variados
        const selected = shuffledBackup.slice(0, 8).map((url, i) => ({
            url: url,
            title: shuffledTitles[i]?.title || 'Nail Art Inspiração'
        }));
        
        grid.innerHTML = selected.map((item, index) => `
            <div class="inspiration-item" id="insp-${index}" onclick="openInspirationModal('${item.url}', '${item.title}')">
                <img src="${item.url}" alt="${item.title}" loading="lazy" 
                    onload="this.parentElement.classList.add('loaded')"
                    onerror="handleImageError(this, ${index})">
                <div class="inspiration-overlay">
                    <span>${item.title}</span>
                </div>
                <div class="inspiration-actions">
                    <button onclick="event.stopPropagation(); saveToGallery('${item.url}', '${item.title}')" title="Salvar na Galeria">
                        <i class="fas fa-bookmark"></i>
                    </button>
                    <button onclick="event.stopPropagation(); shareInspiration('${item.url}')" title="Compartilhar">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }, 300);
}

// Handle image loading errors
function handleImageError(img, index) {
    // Try alternative placeholder with nail art theme
    const fallbackUrl = backupNailImages[index % backupNailImages.length];
    
    if (img.src !== fallbackUrl) {
        img.src = fallbackUrl;
    } else {
        // If fallback also fails, show a gradient placeholder
        img.style.display = 'none';
        img.parentElement.style.background = 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%)';
        img.parentElement.innerHTML += '<div class="inspiration-placeholder"><i class="fas fa-hand-sparkles"></i></div>';
    }
}

function refreshInspirations() {
    loadInspirations();
    showToast('Inspirações atualizadas!');
}

function saveToGallery(url, title) {
    const photo = {
        id: generateId(data.gallery),
        url: url,
        category: 'nail-art',
        clientId: null,
        description: title + ' (Inspiração)',
        createdAt: new Date().toISOString()
    };
    
    data.gallery.push(photo);
    saveData();
    
    addNotification('photo', `Inspiração salva na galeria: ${title}`, { photoId: photo.id });
    showToast('Inspiração salva na galeria!');
}

function shareInspiration(url) {
    if (navigator.share) {
        navigator.share({
            title: 'Inspiração de Unhas',
            text: 'Olha essa inspiração de unhas!',
            url: url
        });
    } else {
        navigator.clipboard.writeText(url);
        showToast('Link copiado para a área de transferência!');
    }
}

function openInspirationModal(url, title) {
    // Create a lightbox effect
    const lightbox = document.createElement('div');
    lightbox.className = 'inspiration-lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
            <img src="${url}" alt="${title}">
            <div class="lightbox-info">
                <h3>${title}</h3>
                <div class="lightbox-actions">
                    <button onclick="saveToGallery('${url}', '${title}'); this.closest('.inspiration-lightbox').remove();">
                        <i class="fas fa-bookmark"></i> Salvar
                    </button>
                    <button onclick="shareInspiration('${url}')">
                        <i class="fas fa-share-alt"></i> Compartilhar
                    </button>
                </div>
            </div>
        </div>
    `;
    lightbox.onclick = (e) => {
        if (e.target === lightbox) lightbox.remove();
    };
    document.body.appendChild(lightbox);
}

// Auto-refresh trends every hour
setInterval(() => {
    loadTrends();
}, 3600000);
