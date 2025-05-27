import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Image, TextInput } from 'react-native';
import { Dimensions } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';


import backgroundImage from './assets/Bienvenido.png';  
import pfpimage from './assets/pfpimage.png'
import backgroundImageStats from './assets/Stadistics.png'
import backgroundImageProfile from './assets/Profile.png'
import backgroundImageMoney from './assets/Money.png'


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
      <ImageBackground source={backgroundImageMoney} style={styles.backgroundImageDinero} resizeMode='cover'>
        <View style={styles.overlay}>
          <Text style={styles.title}>Dinero ahorrado:</Text>
          <Text style={styles.subtitle}>Aquí verás tu dinero ahorrado</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

function AnalisisScreen() {
  const [meta, setMeta] = useState(10000);
  const [progreso, setProgreso] = useState(0); // Este dato puede venir de almacenamiento o WebSocket

  const screenWidth = Dimensions.get('window').width;
  const porcentaje = Math.min(progreso / meta, 1);
  const margen = 30;
  const personajeX = margen + porcentaje * (screenWidth - 2 * margen - 73); // 60 = ancho aprox del personaje

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImageStats} style={styles.backgroundImage} resizeMode="cover">
        <View style={[styles.overlay, { justifyContent: 'flex-start', paddingTop: 100 }]}>
          
          <View style={styles.contenedor_analisis}>
            <Text style={styles.title}>Análisis</Text>

            {/* Visualización parcial del camino */}
            <View style={styles.caminoContainer}>
<Image source={require('./assets/fondoCamino.png')} style={styles.caminoFondo} resizeMode="cover" />
  <Image source={require('./assets/meta.png')} style={[styles.meta, { right: margen }]} resizeMode="contain" />
  <Image source={require('./assets/personaje.png')} style={[styles.personaje, { left: personajeX }]} resizeMode="contain" />
</View>


            {/* Aquí puedes poner más cosas abajo */}
            <View style={{ marginTop: 20 }}>
              <Text style={styles.subtitle}>🎯 Progreso: {progreso} / {meta}</Text>
              {/* Puedes agregar gráficos, tablas, recomendaciones, etc. */}
            </View>

          </View>
        </View>
      </ImageBackground>
    </View>
  );
}



// Pantalla Perfil
function PerfilScreen() {
  const [nombre, setNombre] = useState("");
  const [alias, setAlias] = useState("");
  const [edad, setEdad] = useState("");
  const [escuela, setEscuela] = useState("");
  const [editando, setEditando] = useState(false);

  const cargarDatos = async () => {
    try {
      const n = await AsyncStorage.getItem('@nombre_usuario');
      const a = await AsyncStorage.getItem('@alias_usuario');
      const e = await AsyncStorage.getItem('@edad_usuario');
      const esc = await AsyncStorage.getItem('@escuela_usuario');
      if (n) setNombre(n);
      if (a) setAlias(a);
      if (e) setEdad(e);
      if (esc) setEscuela(esc);
    } catch (e) {
      console.error("Error al cargar datos", e);
    }
  };

  const guardarDatos = async () => {
    try {
      await AsyncStorage.setItem('@nombre_usuario', nombre);
      await AsyncStorage.setItem('@alias_usuario', alias);
      await AsyncStorage.setItem('@edad_usuario', edad);
      await AsyncStorage.setItem('@escuela_usuario', escuela);
      setEditando(false);
    } catch (e) {
      console.error("Error al guardar datos", e);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const categoriaEdad = () => {
    const numEdad = parseInt(edad);
    if (numEdad < 10) return 'menor de 10';
    if (numEdad >= 10 && numEdad <= 15) return 'entre 10 y 15';
    return 'mayor de 15';
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImageProfile} style={styles.backgroundImage} resizeMode='cover'>
        <View style={[styles.overlay, { justifyContent: 'flex-start', paddingTop: 100 }]}>
          <View style={styles.rowContainer}>
            <View style={styles.imageWrapper}>
              <Image source={pfpimage} style={styles.image} />
            </View>
            <View style={styles.column9}>
              <Text style={styles.profileText}>Nombre: {nombre}</Text>
              <Text style={styles.profileText}>Alias: {alias}</Text>
              <Text style={styles.profileText}>Edad: {edad} años</Text>
              <Text style={styles.profileText}>Escuela: {escuela}</Text>
              <Text style={styles.subtitle}>Categoría edad: {categoriaEdad()}</Text>
            </View>
          </View>

          {editando ? (
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor="#ccc" value={nombre} onChangeText={setNombre} />
              <TextInput style={styles.input} placeholder="Alias" placeholderTextColor="#ccc" value={alias} onChangeText={setAlias} />
              <TextInput style={styles.input} placeholder="Edad" placeholderTextColor="#ccc" value={edad} onChangeText={setEdad} keyboardType="numeric" />
              <TextInput style={styles.input} placeholder="Escuela" placeholderTextColor="#ccc" value={escuela} onChangeText={setEscuela} />

              <TouchableOpacity style={styles.saveButton} onPress={guardarDatos}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.customButton} onPress={() => setEditando(true)}>
              <Text style={styles.customButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
          )}
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <Text style={styles.profileText}>💰 Dinero total recaudado: $1.000</Text>
            <Text style={styles.profileText}>🪙 Monedas insertadas: 10</Text>
        </View>

        </View>
      </ImageBackground>
    </View>
  );
}




const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
          initialRouteName="Inicio"
          screenOptions={{
            headerTransparent: true, // 🔹 hace el header transparente
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 24,
              color: 'white', // asegúrate de que el texto se vea sobre el fondo
            },
            headerTintColor: 'white', // color del botón "back"
            headerBackgroundContainerStyle: {
              backgroundColor: 'transparent',
            },
            // Quita sombra (opcional)
            headerStyle: {
              backgroundColor: 'transparent',
              elevation: 0, 
              shadowOpacity: 0,
            },
          }}
        >
        <Stack.Screen name="Inicio" component={HomeScreen} />
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
    paddingBottom: 20, 
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

contenedor_analisis: {
  flex: 1, // sin comillas
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: 20, // sin comillas
},
caminoContainer: {
  width: '90%', // o '100%'
  height: 100,
  position: 'relative',
  marginTop: 20,
  marginBottom: 20,
  borderRadius: 12,
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: 'yellow',
},

meta: {
  position: 'absolute',
  width: 30,
  height: 60,
  top: 30,
  right: 30,
  borderWidth: 2,
  borderColor: 'red',
},

personaje: {
  position: 'absolute',
  width: 30,
  height: 60,
  top: 30,
  left: 30,
  borderWidth: 2,
  borderColor: 'blue',
},


});

