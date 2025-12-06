import React from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
} from "react-native";

type WeatherDetailsModalProps = {
    visible: boolean;
    onClose: () => void;
    weather: any; // Daily forecast
    currentWeather: any; // Hourly forecast
    location: string;
};

export default function WeatherDetailsModal({
    visible,
    onClose,
    weather,
    currentWeather,
    location,
}: WeatherDetailsModalProps) {
    if (!visible) return null;

    // Helper to format time
    const formatTime = (dateString: string) => {
        if (!dateString) return "--:--";
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.header}>
                        <Text style={styles.modalTitle}>Weather Details</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        <Text style={styles.locationText}>{location}</Text>
                        <Text style={styles.dateText}>
                            {new Date().toLocaleDateString(undefined, {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </Text>

                        <View style={styles.divider} />

                        <View style={styles.row}>
                            <DetailItem
                                label="Temperature"
                                value={currentWeather ? `${currentWeather.temp_c}°C` : "--"}
                            />
                            <DetailItem
                                label="Condition"
                                value={
                                    weather?.chance_of_rain > 50
                                        ? "Rainy"
                                        : weather?.chance_of_rain > 20
                                            ? "Cloudy"
                                            : "Sunny"
                                }
                            />
                        </View>

                        <View style={styles.row}>
                            <DetailItem
                                label="Wind"
                                value={currentWeather ? `${currentWeather.wind_kph} kph` : "--"}
                            />
                            <DetailItem
                                label="UV Index"
                                value={currentWeather ? `${currentWeather.uv}` : "--"}
                            />
                        </View>

                        <View style={styles.row}>
                            <DetailItem
                                label="Humidity"
                                value={currentWeather ? `${currentWeather.humidity}%` : "--"}
                            />
                            <DetailItem
                                label="Precipitation"
                                value={currentWeather ? `${currentWeather.precip_mm} mm` : "--"}
                            />
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.row}>
                            <DetailItem
                                label="Sunrise"
                                value={weather ? weather.sunrise : "--"}
                            />
                            <DetailItem
                                label="Sunset"
                                value={weather ? weather.sunset : "--"}
                            />
                        </View>
                        <View style={styles.row}>
                            <DetailItem
                                label="Chance of Rain"
                                value={weather ? `${weather.chance_of_rain}%` : "--"}
                            />
                            <DetailItem
                                label="Chance of Snow"
                                value={weather ? `${weather.chance_of_snow}%` : "--"}
                            />
                        </View>

                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        width: "85%",
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        fontSize: 20,
        color: "#999",
        fontWeight: "bold",
    },
    content: {
        width: "100%",
    },
    locationText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1B4D3E", // Using the green from previous theme as a nice touch
        textAlign: "center",
        marginBottom: 5,
    },
    dateText: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginBottom: 15,
    },
    divider: {
        height: 1,
        backgroundColor: "#eee",
        width: "100%",
        marginVertical: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
        width: "100%",
    },
    detailItem: {
        width: "48%",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        padding: 10,
        borderRadius: 10,
    },
    detailLabel: {
        fontSize: 12,
        color: "#888",
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
});
