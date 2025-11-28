// Constantes CSS reutilizables para mantener consistencia y eliminar duplicados

export const BUTTON_STYLES = {
    primary: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors",
    primaryBold: "bg-blue-500 text-white px-4 py-2 rounded font-semibold hover:bg-blue-600 transition-colors",
    primaryLarge: "bg-blue-500 text-white px-6 py-3 rounded font-semibold hover:bg-blue-600 transition-colors",
    secondary: "bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors",
    secondaryLarge: "bg-gray-500 text-white px-6 py-3 rounded font-semibold hover:bg-gray-600 transition-colors",
    lightGray: "bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold border hover:bg-gray-300 transition-colors",
    success: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors",
    successBold: "bg-green-500 text-white px-4 py-2 rounded font-semibold hover:bg-green-600 transition-colors",
    successLarge: "bg-green-500 text-white px-6 py-3 rounded font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
    danger: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors",
    dangerBold: "bg-red-500 text-white px-4 py-2 rounded font-semibold hover:bg-red-600 transition-colors",
    warning: "bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors",
    warningBold: "bg-yellow-500 text-white px-4 py-2 rounded font-semibold hover:bg-yellow-600 transition-colors",
    purple: "bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors",
    orange: "bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors",
    pink: "bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors",
    pinkBold: "bg-pink-500 text-white px-4 py-2 rounded font-semibold hover:bg-pink-600 transition-colors",
} as const; export const INPUT_STYLES = {
    default: "border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500",
    small: "border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500",
} as const;

export const CARD_STYLES = {
    default: "bg-white rounded-lg shadow-md p-6",
    bordered: "bg-white rounded-lg shadow-md p-6 border",
    premium: "bg-white rounded-lg shadow-md p-6 border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50",
} as const;

export const TEXT_STYLES = {
    label: "block text-sm font-medium text-gray-700 mb-2",
    error: "text-red-600 text-sm mt-1",
    success: "text-green-600 text-sm mt-1",
} as const;