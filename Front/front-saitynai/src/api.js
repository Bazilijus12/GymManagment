import axios from "axios";

const api = axios.create({
    baseURL: "https://seahorse-app-lgdhb.ondigitalocean.app/api", 
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Fetch all gyms
export const fetchGyms = async () => {
    try {
        const response = await api.get("/gyms");
        return response.data;
    } catch (error) {
        console.error("Error fetching gyms:", error);
        throw error;
    }
};

// Fetch a single gym by ID
export const fetchGymById = async (gymId) => {
    try {
        const response = await api.get(`/gyms/${gymId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching gym with ID ${gymId}:`, error);
        throw error;
    }
};

// Create a new gym
export const createGym = async (gymData) => {
    try {
        const response = await api.post("/gyms", gymData);
        return response.data;
    } catch (error) {
        console.error("Error creating gym:", error);
        throw error;
    }
};

// Update an existing gym
export const updateGym = async (gymId, gymData) => {
    try {
        const response = await api.put(`/gyms/${gymId}`, gymData);
        return response.data;
    } catch (error) {
        console.error("Error updating gym:", error);
        throw error;
    }
};

// Delete a gym
export const deleteGym = async (gymId) => {
    try {
        const response = await api.delete(`/gyms/${gymId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting gym:", error);
        throw error;
    }
};

// Register a new user
export const registerUser = async (userData) => {
    try {
        const response = await api.post("/accounts", userData);
        return response.data;
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
};

// Login a user
export const loginUser = async (credentials) => {
    try {
        const response = await api.post("/login", credentials);
        return response.data; // Usually includes a token
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
};

// Fetch all workouts for a gym
export const fetchWorkouts = async (gymId) => {
    try {
        const response = await api.get(`/gyms/${gymId}/workouts`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching workouts for gym ID ${gymId}:`, error);
        throw error;
    }
};


// Fetch a single workout by ID
export const fetchWorkoutById = async (gymId, workoutId) => {
    try {
        const response = await api.get(`/gyms/${gymId}/workouts/${workoutId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching workout ID ${workoutId}:`, error);
        throw error;
    }
};

// Create a new workout
export const createWorkout = async (gymId, workoutData) => {
    try {
        const response = await api.post(`/gyms/${gymId}/workouts`, workoutData);
        return response.data;
    } catch (error) {
        console.error("Error creating workout:", error);
        throw error;
    }
};

// Update an existing workout
export const updateWorkout = async (gymId, workoutId, workoutData) => {
    try {
        const response = await api.put(`/gyms/${gymId}/workouts/${workoutId}`, workoutData);
        return response.data;
    } catch (error) {
        console.error("Error updating workout:", error);
        throw error;
    }
};

export const deleteWorkout = async (gymId, workoutId) => {
    try {
        const response = await api.delete(`/gyms/${gymId}/workouts/${workoutId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting workout:", error);
        throw error;
    }
};


export const fetchReviews = async (gymId, workoutId) => {
    try {
        const response = await api.get(`/gyms/${gymId}/workouts/${workoutId}/reviews`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching reviews for workout ID ${workoutId}:`, error);
        throw error;
    }
};

export const fetchReviewById = async (gymId, workoutId, reviewId) => {
    try {
        const response = await api.get(`/gyms/${gymId}/workouts/${workoutId}/reviews/${reviewId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching review ID ${reviewId}:`, error);
        throw error;
    }
};

export const createReview = async (gymId, workoutId, reviewData) => {
    try {
        const response = await api.post(`/gyms/${gymId}/workouts/${workoutId}/reviews`, reviewData);
        return response.data;
    } catch (error) {
        console.error("Error creating review:", error);
        throw error;
    }
};

export const updateReview = async (gymId, workoutId, reviewId, reviewData) => {
    try {
        const response = await api.put(`/gyms/${gymId}/workouts/${workoutId}/reviews/${reviewId}`, reviewData);
        return response.data;
    } catch (error) {
        console.error(`Error updating review ID ${reviewId}:`, error);
        throw error;
    }
};

export const deleteReview = async (gymId, workoutId, reviewId) => {
    try {
        const response = await api.delete(`/gyms/${gymId}/workouts/${workoutId}/reviews/${reviewId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting review ID ${reviewId}:`, error);
        throw error;
    }
};
// Fetch ended workouts for a gym
export const fetchEndedWorkouts = async (gymId) => {
    try {
        const response = await api.get(`/gyms/${gymId}/workouts/ended`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching ended workouts for gym ID ${gymId}:`, error);
        throw error;
    }
};


export default api;
