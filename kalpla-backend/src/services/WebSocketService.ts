import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

export class WebSocketService {
  private io: SocketIOServer;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId
  private sessionRooms: Map<string, Set<string>> = new Map(); // sessionId -> Set of userIds

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      // User authentication
      socket.on('authenticate', (data) => {
        const { userId, userRole } = data;
        this.connectedUsers.set(userId, socket.id);
        socket.data.userId = userId;
        socket.data.userRole = userRole;
        
        console.log(`User authenticated: ${userId} (${userRole})`);
        socket.emit('authenticated', { success: true });
      });

      // Join a session room
      socket.on('join-session', (data) => {
        const { sessionId } = data;
        const userId = socket.data.userId;
        
        if (!userId) {
          socket.emit('error', { message: 'User not authenticated' });
          return;
        }

        socket.join(`session-${sessionId}`);
        
        // Track session participants
        if (!this.sessionRooms.has(sessionId)) {
          this.sessionRooms.set(sessionId, new Set());
        }
        this.sessionRooms.get(sessionId)?.add(userId);

        console.log(`User ${userId} joined session ${sessionId}`);
        
        // Notify others in the session
        socket.to(`session-${sessionId}`).emit('user-joined', {
          userId,
          userRole: socket.data.userRole,
          timestamp: new Date().toISOString()
        });

        // Send current participants to the new user
        const participants = Array.from(this.sessionRooms.get(sessionId) || []);
        socket.emit('session-participants', { participants });
      });

      // Leave a session room
      socket.on('leave-session', (data) => {
        const { sessionId } = data;
        const userId = socket.data.userId;
        
        if (!userId) return;

        socket.leave(`session-${sessionId}`);
        
        // Remove from session tracking
        this.sessionRooms.get(sessionId)?.delete(userId);
        
        console.log(`User ${userId} left session ${sessionId}`);
        
        // Notify others in the session
        socket.to(`session-${sessionId}`).emit('user-left', {
          userId,
          timestamp: new Date().toISOString()
        });
      });

      // Send chat message
      socket.on('send-message', (data) => {
        const { sessionId, content, type = 'text' } = data;
        const userId = socket.data.userId;
        const userRole = socket.data.userRole;
        
        if (!userId) {
          socket.emit('error', { message: 'User not authenticated' });
          return;
        }

        const message = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          userRole,
          content,
          type,
          timestamp: new Date().toISOString()
        };

        // Broadcast to all users in the session
        this.io.to(`session-${sessionId}`).emit('new-message', message);
        
        console.log(`Message sent in session ${sessionId} by user ${userId}`);
      });

      // Typing indicator
      socket.on('typing-start', (data) => {
        const { sessionId } = data;
        const userId = socket.data.userId;
        
        if (!userId) return;

        socket.to(`session-${sessionId}`).emit('user-typing', {
          userId,
          isTyping: true,
          timestamp: new Date().toISOString()
        });
      });

      socket.on('typing-stop', (data) => {
        const { sessionId } = data;
        const userId = socket.data.userId;
        
        if (!userId) return;

        socket.to(`session-${sessionId}`).emit('user-typing', {
          userId,
          isTyping: false,
          timestamp: new Date().toISOString()
        });
      });

      // Screen sharing events
      socket.on('start-screen-share', (data) => {
        const { sessionId } = data;
        const userId = socket.data.userId;
        
        if (!userId) return;

        socket.to(`session-${sessionId}`).emit('screen-share-started', {
          userId,
          timestamp: new Date().toISOString()
        });
      });

      socket.on('stop-screen-share', (data) => {
        const { sessionId } = data;
        const userId = socket.data.userId;
        
        if (!userId) return;

        socket.to(`session-${sessionId}`).emit('screen-share-stopped', {
          userId,
          timestamp: new Date().toISOString()
        });
      });

      // Hand raise feature
      socket.on('raise-hand', (data) => {
        const { sessionId } = data;
        const userId = socket.data.userId;
        
        if (!userId) return;

        socket.to(`session-${sessionId}`).emit('hand-raised', {
          userId,
          timestamp: new Date().toISOString()
        });
      });

      socket.on('lower-hand', (data) => {
        const { sessionId } = data;
        const userId = socket.data.userId;
        
        if (!userId) return;

        socket.to(`session-${sessionId}`).emit('hand-lowered', {
          userId,
          timestamp: new Date().toISOString()
        });
      });

      // Session control (mentor only)
      socket.on('session-control', (data) => {
        const { sessionId, action, payload } = data;
        const userId = socket.data.userId;
        const userRole = socket.data.userRole;
        
        if (!userId || userRole !== 'mentor') {
          socket.emit('error', { message: 'Unauthorized' });
          return;
        }

        // Broadcast session control event
        this.io.to(`session-${sessionId}`).emit('session-control-event', {
          action,
          payload,
          timestamp: new Date().toISOString()
        });
      });

      // Disconnect handling
      socket.on('disconnect', () => {
        const userId = socket.data.userId;
        
        if (userId) {
          this.connectedUsers.delete(userId);
          
          // Remove from all session rooms
          for (const [sessionId, participants] of this.sessionRooms.entries()) {
            if (participants.has(userId)) {
              participants.delete(userId);
              socket.to(`session-${sessionId}`).emit('user-left', {
                userId,
                timestamp: new Date().toISOString()
              });
            }
          }
          
          console.log(`User disconnected: ${userId}`);
        }
      });
    });
  }

  /**
   * Send notification to a specific user
   */
  sendToUser(userId: string, event: string, data: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  /**
   * Send notification to all users in a session
   */
  sendToSession(sessionId: string, event: string, data: any) {
    this.io.to(`session-${sessionId}`).emit(event, data);
  }

  /**
   * Send notification to all users
   */
  broadcast(event: string, data: any) {
    this.io.emit(event, data);
  }

  /**
   * Get connected users count
   */
  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  /**
   * Get session participants count
   */
  getSessionParticipantsCount(sessionId: string): number {
    return this.sessionRooms.get(sessionId)?.size || 0;
  }

  /**
   * Get all session participants
   */
  getSessionParticipants(sessionId: string): string[] {
    return Array.from(this.sessionRooms.get(sessionId) || []);
  }
}
