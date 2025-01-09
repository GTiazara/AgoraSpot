import { reactive } from 'vue';

const state = reactive({
    map: null, // Hold the map instance
});

export function useMap() {
    return {
        get map() {
            return state.map; // Retrieve the map instance
        },
        set map(value) {
            state.map = value; // Set the map instance
        },
    };
}
