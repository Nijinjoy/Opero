import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import SplashScreen from '../screens/auth/SplashScreen';
import VerifyOtpScreen from '../screens/auth/VerifyOtpScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import { colors } from '../theme/colors';

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  VerifyOtp: { dialCode: string; phone: string };
};

const Stack = createStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#FFFFFF' },
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
          cardOverlayEnabled: false,
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ cardStyle: { backgroundColor: colors.brand } }}
        />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
