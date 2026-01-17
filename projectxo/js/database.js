// js/database.js - COMPLETE DATABASE CODE
import { db } from './firebase-config.js';
import { 
    doc, setDoc, getDoc, updateDoc, 
    collection, addDoc, getDocs, query, 
    where, onSnapshot, orderBy, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. Save user profile to Firestore
export async function saveUserProfile(userId, profileData) {
    try {
        console.log("💾 Saving profile to Firestore for user:", userId);
        
        await setDoc(doc(db, "users", userId), {
            ...profileData,
            uid: userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        
        console.log("✅ Profile saved successfully!");
        return { success: true };
    } catch (error) {
        console.error("❌ Error saving profile:", error);
        return { success: false, error: error.message };
    }
}

// 2. Get user profile from Firestore
export async function getUserProfile(userId) {
    try {
        console.log("📥 Getting profile for user:", userId);
        
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            console.log("✅ Profile found!");
            return { success: true, profile: docSnap.data() };
        } else {
            console.log("⚠️ No profile found");
            return { success: false, error: "Profile not found" };
        }
    } catch (error) {
        console.error("❌ Error getting profile:", error);
        return { success: false, error: error.message };
    }
}

// 3. Get ALL users (for explore page)
export async function getAllUsers(currentUserId) {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "!=", currentUserId));
        const querySnapshot = await getDocs(q);
        
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });
        
        console.log(`📊 Found ${users.length} users`);
        return { success: true, users };
    } catch (error) {
        console.error("❌ Error getting users:", error);
        return { success: false, error: error.message };
    }
}

// 4. Send connection request
export async function sendConnectionRequest(fromUserId, toUserId, message) {
    try {
        const requestData = {
            from: fromUserId,
            to: toUserId,
            message: message,
            status: 'pending',
            timestamp: serverTimestamp()
        };
        
        await addDoc(collection(db, "connections"), requestData);
        console.log("✅ Connection request sent!");
        return { success: true };
    } catch (error) {
        console.error("❌ Error sending request:", error);
        return { success: false, error: error.message };
    }
}

// 5. Real-time chat: Send message
export async function sendMessage(chatId, senderId, message) {
    try {
        const messageData = {
            senderId,
            text: message,
            timestamp: serverTimestamp()
        };
        
        await addDoc(collection(db, "chats", chatId, "messages"), messageData);
        console.log("💬 Message sent!");
        return { success: true };
    } catch (error) {
        console.error("❌ Error sending message:", error);
        return { success: false, error: error.message };
    }
}

// 6. Real-time chat: Listen to messages
export function listenToMessages(chatId, callback) {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));
    
    console.log("👂 Listening to messages for chat:", chatId);
    return onSnapshot(q, (snapshot) => {
        const messages = [];
        snapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() });
        });
        callback(messages);
    });
}

// 7. Get connection requests for a user
export async function getConnectionRequests(userId) {
    try {
        const connectionsRef = collection(db, "connections");
        const q = query(connectionsRef, where("to", "==", userId), where("status", "==", "pending"));
        const querySnapshot = await getDocs(q);
        
        const requests = [];
        querySnapshot.forEach((doc) => {
            requests.push({ id: doc.id, ...doc.data() });
        });
        
        console.log(`📨 Found ${requests.length} pending requests`);
        return { success: true, requests };
    } catch (error) {
        console.error("❌ Error getting requests:", error);
        return { success: false, error: error.message };
    }
}

// 8. Update connection request status
export async function updateRequestStatus(requestId, status) {
    try {
        await updateDoc(doc(db, "connections", requestId), {
            status: status,
            respondedAt: serverTimestamp()
        });
        console.log(`✅ Request ${requestId} updated to: ${status}`);
        return { success: true };
    } catch (error) {
        console.error("❌ Error updating request:", error);
        return { success: false, error: error.message };
    }
}