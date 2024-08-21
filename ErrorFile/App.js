import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import SplashScreen from './Componant/SplashScreen';  
import Login from './Pages/Login';
import SignIn from './Pages/SignIn'; 
import SignUp from './Pages/SignUp';
import ModelScreen from './Componant/ModelScreen';
import Dashboard from './Pages/Dashboard';
import OTPvarify from './Componant/OTPvarify';
import PropertyDetail from './Pages/PropertyDetail';
import FullPropertyDetails from './Componant/FullPropertyDetails';
import ForgotPass from './Componant/ForgotPass';
import Profile from './Pages/Profile';
import WishList from './Pages/WishList';
import ResetPass from './Componant/ResetPass';
import ChangePassword from './Componant/ChangePassword';
import Filter from './Pages/Filter';
import LeadGenrate from './Pages/LeadGenrate';
import ThreeDModel from './Pages/ThreeDModel';
import AdminDashboard from './Pages/AdminDashboard';
import PropertyCards from './Pages/PropertyCards'
import EditProperties from './Pages/EditProperties';
import AddProperties from './Pages/AddProperty';
import AdminPropertyDetail from './Pages/AdminPropertyDetail';
import AddAgent from './Pages/AddAgent';
import AgentOTPvarify from './Componant/AgentOTPvarify'
import AllAgents from './Pages/AllAgents';
import UpdateAgent from './Pages/UpdateAgent';
import EmployeeDashboard from './Pages/EmployeeDashboard';
import AllEmployeeProperty from "./Pages/AllEmployeeProperty"
import CustomeField from './Pages/CustomeField';
import AddEmployeePropert from './Pages/AddEmployeePropert';
import AgentsProperties from './Pages/AgentsProperties';
import Leads from './Pages/Leads';
import AllQueries from './Pages/AllQueries';
import PropertyDetailsQueries from './Pages/PropertyDetailsQueries';
import EmployeeLeads from './Pages/EmployeeLeads';

const Stack = createStackNavigator();

const App = () => {
  
  return (
    <SafeAreaView style={styles.safezone}>
      <View style={styles.container}>
        <StatusBar backgroundColor="#122620" barStyle="light-content" translucent={false} />
        <NavigationContainer>
          <Stack.Navigator 
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: '#122620' },
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Forgot" component={ForgotPass} />
            <Stack.Screen name="ResetPass" component={ResetPass} />
            <Stack.Screen name='Dashboard' component={Dashboard}/>
            <Stack.Screen name='ThreeModel' component={ThreeDModel}/>
            <Stack.Screen name='Filter' component={Filter}/>
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="Saved" component={WishList} />
            <Stack.Screen name="model" component={ModelScreen} />
            <Stack.Screen name="otpvarify" component={OTPvarify} />
            <Stack.Screen name="LeadGenrate" component={LeadGenrate} />
            <Stack.Screen name="Prodetail" component={PropertyDetail} />
            <Stack.Screen name="FullPropertyDetails" component={FullPropertyDetails} />


            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            <Stack.Screen name="Properties" component={PropertyCards} />
            <Stack.Screen name="AdminProdetail" component={AdminPropertyDetail} />
            <Stack.Screen name="AddAgent" component={AddAgent} />
            <Stack.Screen name="AllAgents" component={AllAgents} />
            <Stack.Screen name="UpdateAgent" component={UpdateAgent} />
            <Stack.Screen name="AgentOTPvarify" component={AgentOTPvarify} />
            <Stack.Screen name="lead" component={Leads}/>
            <Stack.Screen name="EditProperties" component={EditProperties}/>
            <Stack.Screen name="AddProperties" component={AddProperties}/>
            <Stack.Screen name="CustomField" component={CustomeField}/>
            <Stack.Screen name="agentproperty" component={AgentsProperties}/>
            <Stack.Screen name="Allqueries" component={AllQueries}/>
            <Stack.Screen name="propertyDetailsQueries" component={PropertyDetailsQueries}/>


            <Stack.Screen name="EmployeeDash" component={EmployeeDashboard}/>
            <Stack.Screen name="AllEmpProperty" component={AllEmployeeProperty}/>
            <Stack.Screen name="AddEmpProperty" component={AddEmployeePropert}/>
            <Stack.Screen name="EmployeeLead" component={EmployeeLeads}/>


          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safezone: {
    flex: 1,
  },
});

export default App;
