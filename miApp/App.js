import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Image, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import backgroundImage from './assets/Bienvenido.png';  
import backgroundImageDinero from './assets/portadaDinero.png'
import pfpimage from './assets/pfpimage.png'

// Pantalla principal
function HomeScreen({ navigation }) {
  const [contador, setContador] = useState(0);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://192.168.1.26/ws');

    ws.current.onopen = () => {
      console.log('Conexión WebSocket abierta');
    };
    
    ws.current.onmessage = (event) => {
      console.log('Mensaje recibido:', event.data);
      try {
        const json = JSON.parse(event.data);
        setContador(json.contador ?? 0);
      } catch (e) {
        console.error('Error al parsear JSON:', e.message);
      }
    };

    ws.current.onclose = () => {
      console.log('Conexión WebSocket cerrada');
    };

    ws.current.onerror = (error) => {
      console.error('Error en WebSocket:', error.message);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleReset = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send('reset');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode='cover'>
        <View style={styles.overlay}>
          <Text style={styles.title}>Bienvenido a GeoPiggy</Text>
          <Text style={styles.subtitle}>Tu alcancia inteligente de confianza.</Text>
        </View>
        <View style={styles.footerContainer}>
          <View style={styles.footer}>
            <CustomButton title="Dinero" onPress={() => navigation.navigate('Dinero')} />
            <CustomButton title="Perfil" onPress={() => navigation.navigate('Perfil')} />
            <CustomButton title="Metas y Analisis" onPress={() => navigation.navigate('Analisis')} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

// Pantalla Dinero
function DineroScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImageDinero} style={styles.backgroundImageDinero} resizeMode='cover'>
        <View style={styles.overlay}>
          <Text style={styles.title}>Dinero ahorrado:</Text>
          <Text style={styles.subtitle}>Aquí verás tu dinero ahorrado</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

// Pantalla Perfil
function PerfilScreen() {
  const [nombre, setNombre] = useState("Rellena tus datos");
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [editando, setEditando] = useState(false);

  // Cargar el nombre guardado al iniciar
  useEffect(() => {
    const cargarNombre = async () => {
      try {
        const valorGuardado = await AsyncStorage.getItem('@nombre_usuario');
        if (valorGuardado !== null) {
          setNombre(valorGuardado);
        }
      } catch (e) {
        console.error("Error al cargar nombre guardado", e);
      }
    };
    cargarNombre();
  }, []);

  // Guardar el nombre cuando se actualiza
  const guardarNombre = async (nuevo) => {
    try {
      await AsyncStorage.setItem('@nombre_usuario', nuevo);
    } catch (e) {
      console.error("Error al guardar nombre", e);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode='cover'>
        <View style={[styles.overlay, { justifyContent: 'flex-start', paddingTop: 60 }]}>
          <View style={styles.rowContainer}>
            <View style={styles.imageWrapper}>
              <Image source={pfpimage} style={styles.image} />
            </View>
            <View style={styles.column9}>
              <Text style={styles.profileText}>Perfil: {nombre}</Text>
              <Text style={styles.subtitle}>Dinero acumulado total: tanto</Text>
            </View>
          </View>

          <View style={styles.footer}>
            {editando ? (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Escribe tu nuevo nombre"
                  placeholderTextColor="#ccc"
                  value={nuevoNombre}
                  onChangeText={setNuevoNombre}
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    setNombre(nuevoNombre);
                    guardarNombre(nuevoNombre);
                    setEditando(false);
                    setNuevoNombre("");
                  }}
                >
                  <Text style={styles.saveButtonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.customButton} onPress={() => setEditando(true)}>
                <Text style={styles.customButtonText}>Cambiar nombre</Text>
              </TouchableOpacity>
            )}
          </View>

        </View>
      </ImageBackground>
    </View>
  );
}


// Pantalla Análisis
function AnalisisScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Pantalla de Análisis</Text>
    </View>
  );
}

// Crear el Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Dinero" component={DineroScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
        <Stack.Screen name="Analisis" component={AnalisisScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function CustomButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.customButton} onPress={onPress}>
      <Text style={styles.customButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',  // para separar overlay y footer
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  title: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginTop: 10,
  },
  footerContainer: {
    paddingBottom: 20,  // espacio para evitar que se tape con la barra del sistema
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  customButton: {
  backgroundColor: 'white',
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 12,
  marginHorizontal: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 5,
},
customButtonText: {
  color: '#333',
  fontWeight: 'bold',
  fontSize: 16,
  textAlign: 'center',
},
backgroundImageDinero: {
  flex: 1,
  width: '100%',
  height: '100%',
  justifyContent: 'space-between',
},
rowContainer: {
  flexDirection: 'row', // Columnas horizontales
  width: '100%',
  padding: 10,
},
column3: {
  flex: 3, // 3 de 12 partes
  justifyContent: 'center',
  alignItems: 'center',
},
column9: {
  flex: 9, // 9 de 12 partes
  justifyContent: 'center',
  paddingLeft: 10,
},
imageWrapper: {
  justifyContent: 'center',
  alignItems: 'center',
  padding: 4,
  borderRadius: 60,
  backgroundColor: '#fff',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5,
  marginRight: 10,
  marginLeft: 10,
},
image: {
  width: 100,
  height: 100,
  borderRadius: 50,
},
profileText: {
  fontSize: 18,
  fontWeight: 'bold',
  color: 'white',
},
inputContainer: {
  width: '80%',
  marginTop: 20,
  alignItems: 'center',
},

input: {
  backgroundColor: 'white',
  padding: 10,
  borderRadius: 8,
  fontSize: 16,
  marginBottom: 10, // <- Esto separa del botón
  width: '100%',
},

saveButton: {
  backgroundColor: '#4CAF50',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
  alignItems: 'center',
},

saveButtonText: {
  color: 'white',
  fontWeight: 'bold',
},

});

