import Button from "@/components/ui/button";
import { useAppThemeColor } from "@/theme/app-theme";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Image, ImageBackground, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const bgImg = require("../../../assets/images/app-images/welcome-background.png");
const logo = require("../../../assets/images/app-images/logo.png");
const mockup = require("../../../assets/images/app-images/app-mockup.png");

const Welcome = () => {
    const primaryForeground = useAppThemeColor("primaryForeground");

    return (
        <ImageBackground className="flex-1" resizeMode="cover" source={bgImg}>
            <View className="absolute inset-0 bg-black/20" />
            <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
                <ScrollView
                    contentContainerClassName="flex-grow px-5 pb-4 pt-2"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="items-center">
                        <View className="h-20 overflow-hidden w-36">
                            <Image className="size-full" resizeMode="cover" source={logo} />
                        </View>
                        <Text className="-mt-2 font-inter-bold text-[30px] tracking-[-0.8px] text-white">
                            MyWorkout
                        </Text>
                        <Text className="mt-1 font-inter text-[13px] text-white/70">
                            Track. Train. Transform.
                        </Text>
                    </View>

                    <View className="relative -mt-2 h-[300px] flex-grow items-center overflow-hidden">
                        <Image
                            className="absolute inset-0 scale-110 size-full"
                            resizeMode="contain"
                            source={mockup}
                        />
                    </View>

                    <View className="items-center">
                        <Text className="text-center font-inter-bold text-[30px] leading-9 tracking-[-0.8px] text-white">
                            Stronger Every Workout.
                        </Text>
                        <Text className="mt-2 text-center font-inter text-[15px] text-white/70">
                            Build muscle. Track every rep.
                        </Text>
                    </View>

                    <Link
                        href={{
                            pathname: "/onboarding/[step]",
                            params: { step: "gender" },
                        }}
                        asChild
                    >
                        <Button
                            className="mt-6"
                            rightIcon={
                                <View className="absolute right-5">
                                    <Feather
                                        color={primaryForeground}
                                        name="arrow-right"
                                        size={23}
                                    />
                                </View>
                            }
                        >
                            Get Started
                        </Button>
                    </Link>

                    <View className="flex-row items-center justify-center mt-3">
                        <Text className="font-inter text-[13px] text-white/70">
                            Already have an account?{" "}
                        </Text>
                        <Link href="/sign-in" asChild>
                            <Pressable className="justify-center px-1 min-h-11">
                                <Text className="font-inter-semibold text-[13px] text-primary">
                                    Sign In
                                </Text>
                            </Pressable>
                        </Link>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
};

export default Welcome;