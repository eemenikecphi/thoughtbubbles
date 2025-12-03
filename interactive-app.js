// MoboRev Interactive Demo - JavaScript
class MoboRevApp {
    constructor() {
        this.thoughts = [];
        this.notifications = [];
        this.notificationCount = 3;
        this.currentReplyThoughtId = null;
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.dailyChallenges = this.generateDailyChallenges();
        this.profiles = {
            user: {
                name: "Alice",
                petName: "Sunshine",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                initials: "AJ"
            },
            partner: {
                name: "Bob",
                petName: "Sweetheart", 
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                initials: "BS"
            }
        };
        this.init();
        this.loadProfilesFromStorage();
        this.loadInitialData();
        this.showDailyChallengeIfNeeded();
    }

    init() {
        // Event listeners
        document.getElementById('addThoughtBtn').addEventListener('click', () => this.showAddThoughtModal());
        document.getElementById('shareThoughtBtn').addEventListener('click', () => this.addThought());
        document.getElementById('cancelThoughtBtn').addEventListener('click', () => this.hideAddThoughtModal());
        
        document.getElementById('submitReplyBtn').addEventListener('click', () => this.addReply());
        document.getElementById('cancelReplyBtn').addEventListener('click', () => this.hideReplyModal());
        
        document.getElementById('notificationBtn').addEventListener('click', () => this.showNotificationModal());
        document.getElementById('closeNotificationsBtn').addEventListener('click', () => this.hideNotificationModal());
        document.getElementById('clearNotificationsBtn').addEventListener('click', () => this.clearNotifications());
        
        document.getElementById('mindMapBtn').addEventListener('click', () => this.showMindMapModal());
        document.getElementById('closeMindMapBtn').addEventListener('click', () => this.hideMindMapModal());
        
        // Mind map controls
        document.getElementById('forceViewBtn').addEventListener('click', () => this.setMindMapView('force'));
        document.getElementById('radialViewBtn').addEventListener('click', () => this.setMindMapView('radial'));
        document.getElementById('timelineViewBtn').addEventListener('click', () => this.setMindMapView('timeline'));
        
        document.getElementById('filterAllBtn').addEventListener('click', () => this.setMindMapFilter('all'));
        document.getElementById('filterMineBtn').addEventListener('click', () => this.setMindMapFilter('mine'));
        document.getElementById('filterPartnerBtn').addEventListener('click', () => this.setMindMapFilter('partner'));
        
        document.getElementById('startDemoBtn').addEventListener('click', () => this.startDemo());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetApp());
        document.getElementById('testNotificationsBtn').addEventListener('click', () => this.testNotifications());
        
        document.getElementById('expandInsightBtn').addEventListener('click', () => this.toggleInsight());
        
        // Profile management
        document.getElementById('profileBtn').addEventListener('click', () => this.showProfileModal());
        document.getElementById('closeProfileBtn').addEventListener('click', () => this.hideProfileModal());
        document.getElementById('saveProfileBtn').addEventListener('click', () => this.saveProfile());
        document.getElementById('userAvatarInput').addEventListener('change', (e) => this.handleAvatarUpload(e, 'user'));
        document.getElementById('partnerAvatarInput').addEventListener('change', (e) => this.handleAvatarUpload(e, 'partner'));
        
        // Add live preview updates for pet names
        document.getElementById('userPetNameInput').addEventListener('input', () => this.updatePreviewNames());
        document.getElementById('partnerPetNameInput').addEventListener('input', () => this.updatePreviewNames());
        
        // Tab navigation
        document.getElementById('profilesTabBtn').addEventListener('click', () => this.switchTab('profiles'));
        document.getElementById('accountTabBtn').addEventListener('click', () => this.switchTab('account'));
        document.getElementById('relationshipTabBtn').addEventListener('click', () => this.switchTab('relationship'));
        document.getElementById('privacyTabBtn').addEventListener('click', () => this.switchTab('privacy'));
        
        // Account actions
        document.getElementById('changePasswordBtn').addEventListener('click', () => this.changePassword());
        document.getElementById('sendPasswordResetBtn').addEventListener('click', () => this.sendPasswordReset());
        document.getElementById('downloadDataBtn').addEventListener('click', () => this.downloadData());
        document.getElementById('deleteAccountBtn').addEventListener('click', () => this.deleteAccount());
        
        // Relationship actions
        document.getElementById('sendInviteBtn').addEventListener('click', () => this.sendPartnerInvite());
        document.getElementById('disconnectPartnerBtn').addEventListener('click', () => this.disconnectPartner());
        document.getElementById('sendNewInviteBtn').addEventListener('click', () => this.sendNewInvite());
        
        // Privacy actions
        document.getElementById('exportConversationsBtn').addEventListener('click', () => this.exportConversations());
        document.getElementById('clearAllDataBtn').addEventListener('click', () => this.clearAllData());
        
        // Voice recording
        document.getElementById('voiceRecordBtn').addEventListener('click', () => this.toggleVoiceRecording());
        
        // Daily challenge
        document.getElementById('acceptChallengeBtn').addEventListener('click', () => this.acceptDailyChallenge());
        document.getElementById('skipChallengeBtn').addEventListener('click', () => this.skipDailyChallenge());
        
        // Input listeners
        document.getElementById('thoughtInput').addEventListener('input', (e) => this.updateCharCount(e, 'charCount', 500));
        document.getElementById('replyInput').addEventListener('input', (e) => this.updateCharCount(e, 'replyCharCount', 300));
        
        // Suggestion chips
        document.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                document.getElementById('thoughtInput').value = e.target.textContent;
                this.updateCharCount({target: document.getElementById('thoughtInput')}, 'charCount', 500);
            });
        });
        
        // Close modals on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideAllModals();
                }
            });
        });
    }

    loadInitialData() {
        const initialThoughts = [
            {
                id: 1,
                content: "I've been thinking about how grateful I am for the little things you do every day. Like making coffee in the morning - it's such a small gesture but it means the world to me.",
                author: "You",
                authorId: "user",
                time: "2 hours ago",
                color: "#FFB3E6",
                replies: [
                    {
                        id: 11,
                        content: "This makes my heart so full! I love our morning routine together. ☕❤️",
                        author: "Your Partner",
                        authorId: "partner",
                        time: "1 hour ago"
                    }
                ]
            },
            {
                id: 2,
                content: "Today I saw a couple holding hands at the park and it reminded me of our first date. Do you remember how nervous we both were?",
                author: "Your Partner",
                authorId: "partner",
                time: "45 minutes ago",
                color: "#B3E6FF",
                replies: [
                    {
                        id: 21,
                        content: "Yes! I was so worried I'd say something embarrassing 😅 But looking back, that nervousness was actually really sweet.",
                        author: "You",
                        authorId: "user",
                        time: "30 minutes ago"
                    }
                ]
            },
            {
                id: 3,
                content: "What if we planned a weekend getaway soon? Just the two of us, no phones, no distractions. I miss having those deep conversations we used to have for hours.",
                author: "Your Partner",
                authorId: "partner",
                time: "15 minutes ago",
                color: "#E6FFB3",
                replies: []
            }
        ];

        this.thoughts = initialThoughts;
        this.renderThoughts();
        this.updateStats();
        
        // Initial notifications
        this.notifications = [
            { id: 1, title: "💭 Weekly Report Ready", body: "Your connection insights are available", time: "1 hour ago", read: false },
            { id: 2, title: "💬 New Reply", body: "Your partner replied to your thought", time: "30 minutes ago", read: false },
            { id: 3, title: "🌟 Connection Milestone", body: "You've shared 5 meaningful thoughts this week!", time: "2 hours ago", read: true }
        ];
    }

    renderThoughts() {
        const container = document.getElementById('thoughtsContainer');
        container.innerHTML = '';

        this.thoughts.forEach((thought, index) => {
            const thoughtEl = this.createThoughtElement(thought, index);
            container.appendChild(thoughtEl);
        });
    }

    createThoughtElement(thought, index) {
        const div = document.createElement('div');
        div.className = `bubble-enter bubble-float ${thought.authorId === 'user' ? '' : 'ml-8'}`;
        div.style.animationDelay = `${index * 0.3}s`;
        
        const profile = this.profiles[thought.authorId];
        
        const isVoiceMessage = thought.isVoiceMessage;
        
        div.innerHTML = `
            <div class="rounded-3xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow" style="background-color: ${thought.color};">
                <div class="flex items-center mb-3">
                    <div class="relative mr-3">
                        <img src="${profile.avatar}" alt="${profile.name}" class="w-10 h-10 rounded-full object-cover border-2 border-white/30" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center absolute top-0 left-0" style="display: none;">
                            <span class="text-sm font-bold">${profile.initials}</span>
                        </div>
                    </div>
                    <div class="flex-1">
                        <p class="font-semibold text-gray-800">${profile.petName}</p>
                        <p class="text-xs text-gray-600">${thought.time}</p>
                    </div>
                    ${isVoiceMessage ? '<div class="bg-blue-100 rounded-full p-2"><span class="text-lg">🎙️</span></div>' : ''}
                </div>
                ${isVoiceMessage ? `
                    <div class="bg-white/20 rounded-lg p-3 mb-3">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-gray-800 font-medium">${thought.content}</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <button class="voice-play-btn bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-700 transition-colors" data-audio-url="${thought.audioUrl}">
                                ▶️
                            </button>
                            <div class="flex-1 bg-white/30 rounded-full h-2">
                                <div class="bg-blue-600 h-2 rounded-full" style="width: 0%"></div>
                            </div>
                            <span class="text-xs text-gray-700">${thought.duration}s</span>
                        </div>
                    </div>
                ` : `<p class="text-gray-800 mb-3">${thought.content}</p>`}
                <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-600">${thought.replies.length} ${thought.replies.length === 1 ? 'reply' : 'replies'}</span>
                    <button class="reply-btn text-blue-600 font-medium hover:text-blue-700 px-3 py-1 rounded-lg hover:bg-white/20 transition-colors" data-thought-id="${thought.id}">Reply</button>
                </div>
                
                <!-- Replies -->
                <div class="replies-container mt-4 space-y-2 ${thought.replies.length === 0 ? 'hidden' : ''}">
                    ${thought.replies.map(reply => {
                        const replyProfile = this.profiles[reply.authorId];
                        return `
                        <div class="bg-white/90 rounded-2xl p-3 ml-4 bubble-enter">
                            <div class="flex items-center mb-2">
                                <div class="relative mr-2">
                                    <img src="${replyProfile.avatar}" alt="${replyProfile.name}" class="w-7 h-7 rounded-full object-cover border border-white" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                    <div class="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center absolute top-0 left-0" style="display: none;">
                                        <span class="text-xs text-white font-bold">${replyProfile.initials}</span>
                                    </div>
                                </div>
                                <span class="font-medium text-sm">${replyProfile.petName}</span>
                                <span class="ml-auto text-xs text-gray-500">${reply.time}</span>
                            </div>
                            <p class="text-gray-800 text-sm">${reply.content}</p>
                        </div>
                    `;}).join('')}
                </div>
            </div>
        `;

        // Add reply button listener
        const replyBtn = div.querySelector('.reply-btn');
        replyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showReplyModal(thought.id);
        });

        // Add voice play button listener
        const voicePlayBtn = div.querySelector('.voice-play-btn');
        if (voicePlayBtn) {
            voicePlayBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playVoiceMessage(thought.audioUrl, voicePlayBtn);
            });
        }

        return div;
    }

    showAddThoughtModal() {
        document.getElementById('addThoughtModal').classList.remove('hide');
        document.getElementById('addThoughtModal').classList.add('show');
        document.getElementById('thoughtInput').focus();
    }

    hideAddThoughtModal() {
        document.getElementById('addThoughtModal').classList.remove('show');
        document.getElementById('addThoughtModal').classList.add('hide');
        document.getElementById('thoughtInput').value = '';
        this.updateCharCount({target: document.getElementById('thoughtInput')}, 'charCount', 500);
    }

    showReplyModal(thoughtId) {
        this.currentReplyThoughtId = thoughtId;
        document.getElementById('replyModal').classList.remove('hide');
        document.getElementById('replyModal').classList.add('show');
        document.getElementById('replyInput').focus();
    }

    hideReplyModal() {
        document.getElementById('replyModal').classList.remove('show');
        document.getElementById('replyModal').classList.add('hide');
        document.getElementById('replyInput').value = '';
        this.currentReplyThoughtId = null;
        this.updateCharCount({target: document.getElementById('replyInput')}, 'replyCharCount', 300);
    }

    addThought() {
        const content = document.getElementById('thoughtInput').value.trim();
        if (!content) return;

        const colors = ['#FFB3E6', '#B3E6FF', '#E6FFB3', '#FFE6B3', '#E6B3FF', '#B3FFE6'];
        const newThought = {
            id: Date.now(),
            content: content,
            author: "You",
            authorId: "user",
            time: "Just now",
            color: colors[Math.floor(Math.random() * colors.length)],
            replies: []
        };

        this.thoughts.unshift(newThought);
        this.renderThoughts();
        this.hideAddThoughtModal();
        this.updateStats();
        
        // Simulate partner notification
        setTimeout(() => {
            this.addNotification("💭 New Thought Shared", `You shared: "${content.substring(0, 30)}..."`);
        }, 1000);
    }

    addReply() {
        const content = document.getElementById('replyInput').value.trim();
        if (!content || !this.currentReplyThoughtId) return;

        const thought = this.thoughts.find(t => t.id === this.currentReplyThoughtId);
        if (!thought) return;

        const newReply = {
            id: Date.now(),
            content: content,
            author: "You",
            authorId: "user",
            time: "Just now"
        };

        thought.replies.push(newReply);
        this.renderThoughts();
        this.hideReplyModal();
        
        // Simulate notification
        setTimeout(() => {
            this.addNotification("💬 Reply Added", `You replied: "${content.substring(0, 30)}..."`);
        }, 500);
    }

    showNotificationModal() {
        document.getElementById('notificationModal').classList.remove('hide');
        document.getElementById('notificationModal').classList.add('show');
        this.renderNotifications();
    }

    hideNotificationModal() {
        document.getElementById('notificationModal').classList.remove('show');
        document.getElementById('notificationModal').classList.add('hide');
    }

    showMindMapModal() {
        document.getElementById('mindMapModal').classList.remove('hide');
        document.getElementById('mindMapModal').classList.add('show');
        this.mindMapView = 'force';
        this.mindMapFilter = 'all';
        this.renderInteractiveMindMap();
    }

    hideMindMapModal() {
        document.getElementById('mindMapModal').classList.remove('show');
        document.getElementById('mindMapModal').classList.add('hide');
    }

    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
            modal.classList.add('hide');
        });
    }

    updateCharCount(e, counterId, maxLength) {
        const count = e.target.value.length;
        document.getElementById(counterId).textContent = count;
        
        if (count > maxLength * 0.9) {
            document.getElementById(counterId).parentElement.classList.add('text-red-500');
        } else {
            document.getElementById(counterId).parentElement.classList.remove('text-red-500');
        }
    }

    addNotification(title, body) {
        const notification = {
            id: Date.now(),
            title: title,
            body: body,
            time: "Just now",
            read: false
        };
        
        this.notifications.unshift(notification);
        this.notificationCount++;
        this.updateNotificationBadge();
        this.showToast(title, body);
    }

    showToast(title, body) {
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-white border border-blue-200 rounded-lg p-4 shadow-lg z-50 max-w-sm bubble-enter';
        toast.innerHTML = `
            <h4 class="font-semibold text-gray-800">${title}</h4>
            <p class="text-sm text-gray-600 mt-1">${body}</p>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 4000);
    }

    renderNotifications() {
        const container = document.getElementById('notificationsList');
        if (this.notifications.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-4xl mb-2">🔔</p>
                    <p class="text-gray-500">No notifications yet</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.notifications.map(notif => `
            <div class="bg-${notif.read ? 'gray-50' : 'blue-50'} rounded-lg p-3 ${notif.read ? '' : 'border-l-4 border-blue-400'}">
                <h4 class="font-medium text-gray-800">${notif.title}</h4>
                <p class="text-sm text-gray-600 mt-1">${notif.body}</p>
                <p class="text-xs text-gray-400 mt-1">${notif.time}</p>
                ${!notif.read ? '<div class="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>' : ''}
            </div>
        `).join('');
    }

    clearNotifications() {
        this.notifications = [];
        this.notificationCount = 0;
        this.updateNotificationBadge();
        this.renderNotifications();
    }

    updateNotificationBadge() {
        const badge = document.getElementById('notificationBadge');
        const countEl = document.getElementById('notificationCount');
        
        if (this.notificationCount > 0) {
            badge.style.display = 'flex';
            countEl.textContent = this.notificationCount > 9 ? '9+' : this.notificationCount;
        } else {
            badge.style.display = 'none';
        }
    }

    setMindMapView(view) {
        this.mindMapView = view;
        
        // Update button states
        document.querySelectorAll('.mind-map-view-btn').forEach(btn => {
            btn.classList.remove('bg-blue-600', 'text-white');
            btn.classList.add('border', 'border-gray-300', 'hover:bg-gray-50');
        });
        
        document.getElementById(`${view}ViewBtn`).classList.remove('border', 'border-gray-300', 'hover:bg-gray-50');
        document.getElementById(`${view}ViewBtn`).classList.add('bg-blue-600', 'text-white');
        
        this.renderInteractiveMindMap();
        this.showToast('View Changed', `Switched to ${view} layout`);
    }

    setMindMapFilter(filter) {
        this.mindMapFilter = filter;
        
        // Update button states
        document.querySelectorAll('.mind-map-filter-btn').forEach(btn => {
            btn.classList.remove('bg-blue-100', 'text-blue-800');
            btn.classList.add('border', 'border-gray-300', 'hover:bg-gray-50');
        });
        
        const filterText = filter === 'mine' ? 'My Thoughts' : filter === 'partner' ? "Partner's" : 'All';
        document.getElementById(`filter${filter === 'mine' ? 'Mine' : filter === 'partner' ? 'Partner' : 'All'}Btn`).classList.remove('border', 'border-gray-300', 'hover:bg-gray-50');
        document.getElementById(`filter${filter === 'mine' ? 'Mine' : filter === 'partner' ? 'Partner' : 'All'}Btn`).classList.add('bg-blue-100', 'text-blue-800');
        
        this.renderInteractiveMindMap();
        this.showToast('Filter Applied', `Showing ${filterText.toLowerCase()}`);
    }

    renderInteractiveMindMap() {
        const svg = document.getElementById('mindMapSvg');
        if (!svg) return;
        
        // Clear previous content
        svg.innerHTML = '';
        
        // Filter thoughts based on current filter
        let filteredThoughts = this.thoughts;
        if (this.mindMapFilter === 'mine') {
            filteredThoughts = this.thoughts.filter(t => t.authorId === 'user');
        } else if (this.mindMapFilter === 'partner') {
            filteredThoughts = this.thoughts.filter(t => t.authorId === 'partner');
        }
        
        if (filteredThoughts.length === 0) {
            // Show empty state
            const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
            foreignObject.setAttribute('width', '100%');
            foreignObject.setAttribute('height', '100%');
            foreignObject.innerHTML = `
                <div class="w-full h-full flex items-center justify-center">
                    <div class="text-center">
                        <p class="text-4xl mb-2">🔍</p>
                        <p class="text-gray-600">No thoughts match this filter</p>
                    </div>
                </div>
            `;
            svg.appendChild(foreignObject);
            return;
        }
        
        const svgRect = svg.getBoundingClientRect();
        const width = svgRect.width || 400;
        const height = svgRect.height || 384;
        
        // Create nodes and connections
        const nodes = [];
        const connections = [];
        
        filteredThoughts.forEach((thought, index) => {
            let x, y;
            
            // Position nodes based on view mode
            if (this.mindMapView === 'radial') {
                const angle = (index / filteredThoughts.length) * 2 * Math.PI;
                const radius = Math.min(width, height) * 0.3;
                x = width/2 + Math.cos(angle) * radius;
                y = height/2 + Math.sin(angle) * radius;
            } else if (this.mindMapView === 'timeline') {
                x = (width / (filteredThoughts.length + 1)) * (index + 1);
                y = height * 0.3;
            } else { // force
                x = Math.random() * (width - 100) + 50;
                y = Math.random() * (height - 100) + 50;
            }
            
            const profile = this.profiles[thought.authorId];
            const nodeSize = 20 + thought.replies.length * 5;
            
            const node = {
                id: thought.id,
                x: x,
                y: y,
                size: nodeSize,
                color: thought.color,
                thought: thought,
                profile: profile
            };
            nodes.push(node);
            
            // Add reply nodes
            thought.replies.forEach((reply, replyIndex) => {
                const replyAngle = (replyIndex / thought.replies.length) * 2 * Math.PI;
                const replyRadius = 60;
                const replyX = x + Math.cos(replyAngle) * replyRadius;
                const replyY = y + Math.sin(replyAngle) * replyRadius;
                
                const replyProfile = this.profiles[reply.authorId];
                const replyNode = {
                    id: reply.id,
                    x: replyX,
                    y: replyY,
                    size: 15,
                    color: replyProfile.avatar,
                    thought: thought,
                    reply: reply,
                    profile: replyProfile,
                    isReply: true
                };
                nodes.push(replyNode);
                
                // Add connection
                connections.push({
                    from: node,
                    to: replyNode
                });
            });
        });
        
        // Draw connections
        connections.forEach(conn => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', conn.from.x);
            line.setAttribute('y1', conn.from.y);
            line.setAttribute('x2', conn.to.x);
            line.setAttribute('y2', conn.to.y);
            line.setAttribute('stroke', '#667eea');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('stroke-opacity', '0.6');
            svg.appendChild(line);
        });
        
        // Draw nodes
        nodes.forEach(node => {
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.style.cursor = 'pointer';
            
            // Node circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', node.x);
            circle.setAttribute('cy', node.y);
            circle.setAttribute('r', node.size);
            circle.setAttribute('fill', node.isReply ? '#667eea' : node.color);
            circle.setAttribute('stroke', '#fff');
            circle.setAttribute('stroke-width', '2');
            group.appendChild(circle);
            
            // Node icon/text
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', node.x);
            text.setAttribute('y', node.y + 5);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-size', '14');
            text.textContent = node.isReply ? '💬' : '💭';
            group.appendChild(text);
            
            // Connection indicator
            if (!node.isReply && node.thought.replies.length > 0) {
                const badge = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                badge.setAttribute('cx', node.x + node.size * 0.7);
                badge.setAttribute('cy', node.y - node.size * 0.7);
                badge.setAttribute('r', '8');
                badge.setAttribute('fill', '#ff6b6b');
                badge.setAttribute('stroke', '#fff');
                badge.setAttribute('stroke-width', '1');
                group.appendChild(badge);
                
                const badgeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                badgeText.setAttribute('x', node.x + node.size * 0.7);
                badgeText.setAttribute('y', node.y - node.size * 0.7 + 3);
                badgeText.setAttribute('text-anchor', 'middle');
                badgeText.setAttribute('font-size', '10');
                badgeText.setAttribute('fill', '#fff');
                badgeText.textContent = node.thought.replies.length;
                group.appendChild(badgeText);
            }
            
            // Click handler
            group.addEventListener('click', () => {
                this.showNodeInfo(node);
                
                // Highlight selected node
                document.querySelectorAll('.selected-node').forEach(el => el.classList.remove('selected-node'));
                circle.classList.add('selected-node');
                circle.setAttribute('stroke', '#333');
                circle.setAttribute('stroke-width', '4');
                
                this.showToast('Node Selected', `${node.profile.petName}: ${node.isReply ? 'Reply' : 'Thought'}`);
            });
            
            // Hover effects
            group.addEventListener('mouseenter', () => {
                circle.setAttribute('stroke-width', '3');
                group.style.transform = 'scale(1.1)';
                group.style.transformOrigin = `${node.x}px ${node.y}px`;
            });
            
            group.addEventListener('mouseleave', () => {
                if (!circle.classList.contains('selected-node')) {
                    circle.setAttribute('stroke-width', '2');
                }
                group.style.transform = 'scale(1)';
            });
            
            svg.appendChild(group);
        });
    }

    showNodeInfo(node) {
        const panel = document.getElementById('nodeInfoPanel');
        const title = document.getElementById('nodeTitle');
        const content = document.getElementById('nodeContent');
        const time = document.getElementById('nodeTime');
        
        if (node.isReply) {
            title.textContent = `💬 Reply by ${node.profile.petName}`;
            content.textContent = node.reply.content;
            time.textContent = node.reply.time;
        } else {
            title.textContent = `💭 Thought by ${node.profile.petName}`;
            content.textContent = node.thought.content;
            time.textContent = node.thought.time;
        }
        
        panel.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            panel.classList.add('hidden');
        }, 5000);
    }

    startDemo() {
        const btn = document.getElementById('startDemoBtn');
        btn.textContent = 'Demo Running...';
        btn.disabled = true;
        
        const demoThoughts = [
            { content: "I was just thinking about our future together and it fills me with so much excitement and joy.", author: "Your Partner", authorId: "partner", color: "#B3E6FF" },
            { content: "You make me want to be the best version of myself every single day.", author: "You", authorId: "user", color: "#FFB3E6" }
        ];
        
        demoThoughts.forEach((thought, index) => {
            setTimeout(() => {
                const newThought = {
                    id: Date.now() + index,
                    ...thought,
                    time: "Just now",
                    replies: []
                };
                
                this.thoughts.unshift(newThought);
                this.renderThoughts();
                this.updateStats();
                
                this.addNotification("💭 Demo Thought", `${thought.author} shared: "${thought.content.substring(0, 30)}..."`);
            }, (index + 1) * 2000);
        });
        
        setTimeout(() => {
            btn.textContent = 'Start Demo';
            btn.disabled = false;
        }, 6000);
    }

    resetApp() {
        this.thoughts = [];
        this.notifications = [];
        this.notificationCount = 0;
        this.renderThoughts();
        this.updateNotificationBadge();
        this.updateStats();
        this.loadInitialData();
        this.showToast('Reset Complete', 'App has been reset to initial state');
    }

    testNotifications() {
        const testNotifs = [
            { title: "💕 Connection Reminder", body: "Share something beautiful with your partner!" },
            { title: "🌟 Weekly Milestone", body: "You've shared 5 meaningful thoughts this week!" },
            { title: "💭 Thoughtful Moment", body: "Small gestures of love create the strongest bonds." }
        ];
        
        testNotifs.forEach((notif, index) => {
            setTimeout(() => {
                this.addNotification(notif.title, notif.body);
            }, index * 1500);
        });
    }

    toggleInsight() {
        const expanded = document.getElementById('expandedInsight');
        const btn = document.getElementById('expandInsightBtn');
        
        if (expanded.classList.contains('hidden')) {
            expanded.classList.remove('hidden');
            btn.textContent = 'Show Less ↑';
        } else {
            expanded.classList.add('hidden');
            btn.textContent = 'See Full Report ↓';
        }
    }

    updateStats() {
        const totalThoughts = this.thoughts.length;
        const totalReplies = this.thoughts.reduce((sum, thought) => sum + thought.replies.length, 0);
        document.getElementById('statsText').textContent = 
            `Current thoughts: ${totalThoughts} | Replies: ${totalReplies} | Interactive demo running!`;
    }

    showProfileModal() {
        document.getElementById('profileModal').classList.remove('hide');
        document.getElementById('profileModal').classList.add('show');
        this.populateProfileForm();
    }

    hideProfileModal() {
        document.getElementById('profileModal').classList.remove('show');
        document.getElementById('profileModal').classList.add('hide');
    }

    populateProfileForm() {
        document.getElementById('userNameInput').value = this.profiles.user.name;
        document.getElementById('userPetNameInput').value = this.profiles.user.petName;
        document.getElementById('partnerNameInput').value = this.profiles.partner.name;
        document.getElementById('partnerPetNameInput').value = this.profiles.partner.petName;
        
        document.getElementById('userAvatarPreview').src = this.profiles.user.avatar;
        document.getElementById('partnerAvatarPreview').src = this.profiles.partner.avatar;
        
        // Update preview names as user types
        this.updatePreviewNames();
    }

    updatePreviewNames() {
        document.getElementById('userNamePreview').textContent = 
            document.getElementById('userPetNameInput').value || 'Your Pet Name';
        document.getElementById('partnerNamePreview').textContent = 
            document.getElementById('partnerPetNameInput').value || 'Partner\'s Pet Name';
    }

    handleAvatarUpload(event, userId) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.profiles[userId].avatar = e.target.result;
                document.getElementById(`${userId}AvatarPreview`).src = e.target.result;
                this.showToast('Photo Updated', `${userId === 'user' ? 'Your' : 'Partner\'s'} profile photo has been updated!`);
            };
            reader.readAsDataURL(file);
        } else {
            this.showToast('Invalid File', 'Please select a valid image file (JPG, PNG, etc.)');
        }
    }

    saveProfile() {
        // Get values from form
        const userName = document.getElementById('userNameInput').value.trim();
        const userPetName = document.getElementById('userPetNameInput').value.trim();
        const partnerName = document.getElementById('partnerNameInput').value.trim();
        const partnerPetName = document.getElementById('partnerPetNameInput').value.trim();

        // Validate inputs
        if (!userName || !userPetName || !partnerName || !partnerPetName) {
            this.showToast('Missing Information', 'Please fill in all name fields');
            return;
        }

        // Update profile data
        this.profiles.user.name = userName;
        this.profiles.user.petName = userPetName;
        this.profiles.partner.name = partnerName;
        this.profiles.partner.petName = partnerPetName;

        // Update header display
        document.querySelector('.text-2xl.font-bold').textContent = `Welcome back,`;
        document.querySelector('.text-lg.opacity-90').textContent = `${userPetName}!`;

        // Re-render thoughts to show updated names and avatars
        this.renderThoughts();
        
        // Show success message
        this.showToast('💕 Profiles Updated!', 'Your pet names and photos have been saved successfully!');
        
        this.hideProfileModal();

        // Save to localStorage for persistence
        localStorage.setItem('moborev_profiles', JSON.stringify(this.profiles));
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.profile-tab-btn').forEach(btn => {
            btn.classList.remove('bg-white', 'text-gray-800', 'shadow-sm');
            btn.classList.add('text-gray-600', 'hover:text-gray-800');
        });
        
        document.getElementById(`${tabName}TabBtn`).classList.remove('text-gray-600', 'hover:text-gray-800');
        document.getElementById(`${tabName}TabBtn`).classList.add('bg-white', 'text-gray-800', 'shadow-sm');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        document.getElementById(`${tabName}Tab`).classList.remove('hidden');
    }

    changePassword() {
        const current = document.getElementById('currentPasswordInput').value;
        const newPassword = document.getElementById('newPasswordInput').value;
        const confirm = document.getElementById('confirmPasswordInput').value;
        
        if (!current || !newPassword || !confirm) {
            this.showToast('Missing Information', 'Please fill in all password fields');
            return;
        }
        
        if (newPassword.length < 8) {
            this.showToast('Password Too Short', 'New password must be at least 8 characters');
            return;
        }
        
        if (newPassword !== confirm) {
            this.showToast('Passwords Don\'t Match', 'Please confirm your new password correctly');
            return;
        }
        
        // Simulate password change
        this.showToast('🔐 Password Updated!', 'Your password has been changed successfully');
        
        // Clear fields
        document.getElementById('currentPasswordInput').value = '';
        document.getElementById('newPasswordInput').value = '';
        document.getElementById('confirmPasswordInput').value = '';
    }

    sendPasswordReset() {
        const email = document.getElementById('emailInput').value;
        this.showToast('📧 Reset Email Sent!', `Password reset link sent to ${email}`);
    }

    downloadData() {
        // Create mock data export
        const data = {
            profile: this.profiles.user,
            thoughts: this.thoughts,
            notifications: this.notifications,
            exported: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'moborev-data-export.json';
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('📱 Data Downloaded!', 'Your data has been exported successfully');
    }

    deleteAccount() {
        if (confirm('⚠️ Are you sure you want to permanently delete your account?\n\nThis action cannot be undone and will delete all your thoughts, conversations, and profile data.')) {
            this.showToast('🗑️ Account Deleted', 'Your account has been permanently deleted');
            // In a real app, this would redirect to a goodbye page
        }
    }

    sendPartnerInvite() {
        const email = document.getElementById('partnerEmailInput').value;
        const message = document.getElementById('inviteMessageInput').value;
        
        if (!email) {
            this.showToast('Missing Email', 'Please enter your partner\'s email address');
            return;
        }
        
        if (!email.includes('@')) {
            this.showToast('Invalid Email', 'Please enter a valid email address');
            return;
        }
        
        // Simulate sending invite
        this.showToast('💌 Invitation Sent!', `Invitation sent to ${email} with your personal message`);
        
        // Clear form
        document.getElementById('partnerEmailInput').value = '';
    }

    disconnectPartner() {
        if (confirm('💔 Are you sure you want to disconnect from your partner?\n\nYour conversations will be preserved, but you won\'t be able to see new thoughts until you reconnect.')) {
            this.showToast('💔 Partner Disconnected', 'You can send a new invitation anytime to reconnect');
        }
    }

    sendNewInvite() {
        // Switch to relationship tab and focus on invite section
        this.switchTab('relationship');
        setTimeout(() => {
            document.getElementById('partnerEmailInput').focus();
        }, 100);
        this.showToast('📮 Ready to Invite', 'Enter your partner\'s email to send a new invitation');
    }

    exportConversations() {
        // Create a formatted conversation export
        const conversationData = {
            participants: [this.profiles.user.name, this.profiles.partner.name],
            exported: new Date().toLocaleDateString(),
            thoughts: this.thoughts.map(thought => ({
                author: this.profiles[thought.authorId].petName,
                content: thought.content,
                time: thought.time,
                replies: thought.replies.map(reply => ({
                    author: this.profiles[reply.authorId].petName,
                    content: reply.content,
                    time: reply.time
                }))
            }))
        };
        
        const blob = new Blob([JSON.stringify(conversationData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'moborev-conversations.json';
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('📄 Conversations Exported!', 'Your conversations have been downloaded');
    }

    clearAllData() {
        if (confirm('🗑️ Are you sure you want to clear all your data?\n\nThis will delete all thoughts, conversations, and reset your profile. This action cannot be undone.')) {
            if (confirm('⚠️ Final confirmation: This will permanently delete everything. Are you absolutely sure?')) {
                this.thoughts = [];
                this.notifications = [];
                this.notificationCount = 0;
                this.renderThoughts();
                this.updateNotificationBadge();
                this.updateStats();
                
                // Clear localStorage
                localStorage.removeItem('moborev_profiles');
                
                this.showToast('🗑️ All Data Cleared', 'Your data has been permanently deleted');
            }
        }
    }

    playVoiceMessage(audioUrl, button) {
        const audio = new Audio(audioUrl);
        
        button.textContent = '⏸️';
        button.classList.add('bg-green-600');
        button.classList.remove('bg-blue-600');
        
        audio.addEventListener('ended', () => {
            button.textContent = '▶️';
            button.classList.remove('bg-green-600');
            button.classList.add('bg-blue-600');
        });
        
        audio.play().catch(() => {
            this.showToast('Audio Error', 'Could not play voice message');
            button.textContent = '▶️';
            button.classList.remove('bg-green-600');
            button.classList.add('bg-blue-600');
        });
    }

    generateDailyChallenges() {
        return [
            {
                id: 1,
                type: "gratitude",
                title: "Gratitude Moment",
                prompt: "Share one thing your partner did recently that made you feel grateful. Be specific about how it made you feel.",
                icon: "🙏",
                color: "#FFE6CC"
            },
            {
                id: 2,
                type: "memory",
                title: "Sweet Memory",
                prompt: "Tell your partner about a favorite memory from your first month together. What made that moment special?",
                icon: "💭",
                color: "#E6F3FF"
            },
            {
                id: 3,
                type: "future",
                title: "Dream Together",
                prompt: "If you could plan the perfect weekend together next month, what would it look like? Share your ideal scenario.",
                icon: "🌟",
                color: "#F0FFE6"
            },
            {
                id: 4,
                type: "appreciation",
                title: "Quality I Admire",
                prompt: "What's one personality trait of your partner that you admire most? Give a specific example of when you noticed it.",
                icon: "❤️",
                color: "#FFE6F0"
            },
            {
                id: 5,
                type: "support",
                title: "How Can I Help?",
                prompt: "What's one thing you could do this week to make your partner's life a little easier or happier?",
                icon: "🤝",
                color: "#E6E6FF"
            },
            {
                id: 6,
                type: "growth",
                title: "Growing Together",
                prompt: "Share something new you've learned about yourself through this relationship. How has your partner helped you grow?",
                icon: "🌱",
                color: "#E6FFE6"
            },
            {
                id: 7,
                type: "fun",
                title: "Playful Moment",
                prompt: "What's the silliest or most playful moment you've shared recently? What made it so fun?",
                icon: "😄",
                color: "#FFF0E6"
            }
        ];
    }

    showDailyChallengeIfNeeded() {
        const today = new Date().toDateString();
        const lastChallengeDate = localStorage.getItem('moborev_last_challenge_date');
        
        if (lastChallengeDate !== today) {
            setTimeout(() => {
                this.showDailyChallenge();
            }, 2000); // Show after 2 seconds
        }
    }

    showDailyChallenge() {
        const dayIndex = new Date().getDay();
        const challenge = this.dailyChallenges[dayIndex];
        
        document.getElementById('challengeIcon').textContent = challenge.icon;
        document.getElementById('challengeTitle').textContent = challenge.title;
        document.getElementById('challengePrompt').textContent = challenge.prompt;
        document.getElementById('challengeCard').style.backgroundColor = challenge.color;
        
        document.getElementById('dailyChallengeModal').classList.remove('hide');
        document.getElementById('dailyChallengeModal').classList.add('show');
    }

    acceptDailyChallenge() {
        const dayIndex = new Date().getDay();
        const challenge = this.dailyChallenges[dayIndex];
        
        // Pre-fill the add thought modal with challenge prompt
        document.getElementById('thoughtInput').value = `💫 Today's ${challenge.title}: ${challenge.prompt}`;
        this.updateCharCount({target: document.getElementById('thoughtInput')}, 'charCount', 500);
        
        // Mark challenge as completed
        localStorage.setItem('moborev_last_challenge_date', new Date().toDateString());
        
        // Hide challenge modal and show add thought modal
        this.hideDailyChallengeModal();
        this.showAddThoughtModal();
        
        this.showToast('🎯 Challenge Accepted!', 'Share your thoughtful response');
    }

    skipDailyChallenge() {
        localStorage.setItem('moborev_last_challenge_date', new Date().toDateString());
        this.hideDailyChallengeModal();
        this.showToast('Maybe Tomorrow', 'Your daily challenge will refresh tomorrow!');
    }

    hideDailyChallengeModal() {
        document.getElementById('dailyChallengeModal').classList.remove('show');
        document.getElementById('dailyChallengeModal').classList.add('hide');
    }

    async toggleVoiceRecording() {
        if (!this.isRecording) {
            await this.startVoiceRecording();
        } else {
            this.stopVoiceRecording();
        }
    }

    async startVoiceRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };

            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                this.handleVoiceMessage(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            
            // Update UI
            const btn = document.getElementById('voiceRecordBtn');
            btn.textContent = '⏹️ Stop Recording';
            btn.classList.add('bg-red-500', 'text-white');
            btn.classList.remove('bg-gray-100');
            
            this.showToast('🎙️ Recording...', 'Tap again to stop and send');

        } catch (error) {
            this.showToast('Microphone Error', 'Please allow microphone access to record voice messages');
        }
    }

    stopVoiceRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            
            // Reset UI
            const btn = document.getElementById('voiceRecordBtn');
            btn.textContent = '🎙️ Voice Message';
            btn.classList.remove('bg-red-500', 'text-white');
            btn.classList.add('bg-gray-100');
        }
    }

    handleVoiceMessage(audioBlob) {
        const audioUrl = URL.createObjectURL(audioBlob);
        const duration = Math.floor(Math.random() * 45) + 15; // Mock duration 15-60 seconds
        
        const voiceThought = {
            id: Date.now(),
            content: `🎙️ Voice message (${duration}s)`,
            audioUrl: audioUrl,
            duration: duration,
            isVoiceMessage: true,
            author: "You",
            authorId: "user",
            time: "Just now",
            color: "#E6F7FF",
            replies: []
        };

        this.thoughts.unshift(voiceThought);
        this.renderThoughts();
        this.updateStats();
        
        this.showToast('🎙️ Voice Message Sent!', `${duration} second voice message shared`);
        
        // Simulate partner notification
        setTimeout(() => {
            this.addNotification("🎙️ Voice Message", "Your partner sent you a voice message");
        }, 1000);
    }

    loadProfilesFromStorage() {
        try {
            const saved = localStorage.getItem('moborev_profiles');
            if (saved) {
                const savedProfiles = JSON.parse(saved);
                this.profiles = { ...this.profiles, ...savedProfiles };
                
                // Update header with saved pet name
                document.querySelector('.text-lg.opacity-90').textContent = `${this.profiles.user.petName}!`;
            }
        } catch (error) {
            console.log('Could not load saved profiles');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MoboRevApp();
});