import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Image, TextInput } from 'react-native';
import { Dimensions } from 'react-native';
import { ProgressProvider } from './ProgressContext';
import { useProgress } from './ProgressContext';
import { useWindowDimensions } from 'react-native';
import CircularProgress from './CircularProgress'; 


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
  const { progreso } = useProgress();

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImageMoney} style={styles.backgroundImageDinero} resizeMode='cover'>
        <View style={styles.overlay}>
          <Text style={styles.title}>Dinero ahorrado:</Text>
          <Text style={styles.subtitle}>💰 ${progreso}</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

function AnalisisScreen() {
    const [meta, setMeta] = useState(10000);
    const { progreso } = useProgress();
    const [edad, setEdad] = useState(null);

    useEffect(() => {
      const obtenerEdad = async () => {
        try {
          const e = await AsyncStorage.getItem('@edad_usuario');
          if (e) setEdad(parseInt(e));
        } catch (err) {
          console.error("Error obteniendo edad:", err);
        }
      };

      obtenerEdad();
    }, []);

    const categoriaEdad = () => {
    if (edad === null) return null;
    if (edad < 10) return 'menor de 10';
    if (edad <= 15) return 'entre 10 y 15';
    return 'mayor de 15';
    };

  const screenWidth = Dimensions.get('window').width;
  const porcentaje = Math.min(progreso / meta, 1);
  const margen = 30;
  const personajeX = margen + porcentaje * (screenWidth - 2 * margen - 73); // 60 = ancho aprox del personaje

  const ruta = obtenerRutaChile(progreso);
  const mostrarPorcentaje = categoriaEdad() === 'mayor de 15';

  const { height: windowHeight } = useWindowDimensions();
  const contenedorAltura = 250;  // Igual que en styles.frascoContainer.height
  const rellenoAltura = porcentaje * contenedorAltura;

  const porcentajeProgreso = Math.min((progreso / meta) * 100, 100);


  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImageStats} style={styles.backgroundImage} resizeMode="cover">
        <View style={[styles.overlay, { justifyContent: 'flex-start', paddingTop: 100 }]}>
          
          <View style={styles.contenedor_analisis}>
            <Text style={styles.title}>Análisis</Text>

            {/* Menores de 10 años */}
            {categoriaEdad() === 'menor de 10' && (
              <View style={styles.caminoContainer}>
                <Image source={require('./assets/fondoCamino.png')} style={styles.caminoFondo} resizeMode="cover" />
                <Image source={require('./assets/meta.png')} style={[styles.meta, { right: margen }]} resizeMode="contain" />
                <Image source={require('./assets/personaje.png')} style={[styles.personaje, { left: personajeX }]} resizeMode="contain" />
              </View>
            )}

            {/* Entre 10 y 15 años */}
            {categoriaEdad() === 'entre 10 y 15' && (
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 5 }}>🎯 Meta: ${meta}</Text>
                <View style={styles.frascoContainer}>
                  <View style={styles.metaLinea} />
                  <Image source={require('./assets/frasco.png')} style={styles.frascoFondo} resizeMode="contain" />
                  <Text style={styles.porcentajeTexto}>{Math.round(porcentaje * 100)}%</Text>

                  <View style={[styles.frascoRelleno, { height: `${porcentaje * 100}%` }]} />
                </View>
              </View>
            )}

            {categoriaEdad() === 'mayor de 15' && (
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Text style={styles.subtitle}>🎯 Meta: ${meta}</Text>
                <CircularProgress progress={porcentajeProgreso} size={130} strokeWidth={10} />
                <Text style={styles.subtitle}>💰 Progreso: ${progreso}</Text>
              </View>
            )}

            {/* Aquí puedes poner más cosas abajo */}
            <View style={{ marginTop: 20 }}>
              <Text style={styles.subtitle}>🎯 Progreso: {progreso} / {meta}</Text>
              {/* Puedes agregar gráficos, tablas, recomendaciones, etc. */}
            </View>

            {ruta && (
              <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
                <Text style={styles.subtitle}>
                  ¿Sabías que para ir de {ruta.desde} a {ruta.hasta} se necesitan {ruta.km} km?
                </Text>
                <Text style={styles.subtitle}>
                  ¡Con lo que llevas ahorrado, podrías hacer ese recorrido!
                </Text>

                {mostrarPorcentaje && (
                  <>
                    <Text style={styles.subtitle}>
                      Eso es aproximadamente el {(progreso / ruta.km * 100).toFixed(1)}% del camino.
                    </Text>
                    <View style={{ marginTop: 10 }}>
                      <Text style={styles.subtitle}>🧠 ¿Cómo se calcula?</Text>
                      <Text style={styles.subtitle}>
                        ({progreso} ÷ {ruta.km}) × 100 = {(progreso / ruta.km * 100).toFixed(1)}%
                      </Text>
                    </View>
                  </>
                )}
              </View>
            )}

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
            <Text style={styles.profileText}>💰 Dinero total recaudado: $20.000</Text>
            <Text style={styles.profileText}>🪙 Monedas insertadas: 34</Text>
        </View>

        </View>
      </ImageBackground>
    </View>
  );
}




const Stack = createStackNavigator();

const rutasChile = [
  // Nacionales 🇨🇱
  { desde: 'Santiago', hasta: 'Valparaíso', km: 120 },
  { desde: 'Santiago', hasta: 'La Serena', km: 470 },
  { desde: 'Santiago', hasta: 'Concepción', km: 510 },
  { desde: 'Santiago', hasta: 'Puerto Montt', km: 1030 },
  { desde: 'Santiago', hasta: 'Punta Arenas', km: 3000 },

  // Internacionales 🌎
  { desde: 'Santiago', hasta: 'Mendoza, Argentina', km: 360 },
  { desde: 'Santiago', hasta: 'Buenos Aires, Argentina', km: 1400 },
  { desde: 'Santiago', hasta: 'La Paz, Bolivia', km: 1900 },
  { desde: 'Santiago', hasta: 'Lima, Perú', km: 3100 },
  { desde: 'Santiago', hasta: 'Quito, Ecuador', km: 4700 },
  { desde: 'Santiago', hasta: 'Bogotá, Colombia', km: 5900 },
  { desde: 'Santiago', hasta: 'Ciudad de Panamá, Panamá', km: 7000 },
  { desde: 'Santiago', hasta: 'Ciudad de México, México', km: 8300 },
  { desde: 'Santiago', hasta: 'Miami, Estados Unidos', km: 7500 },
  { desde: 'Santiago', hasta: 'Nueva York, Estados Unidos', km: 8800 },
  { desde: 'Santiago', hasta: 'Los Ángeles, Estados Unidos', km: 9100 },
];


function obtenerRutaChile(progreso) {
  if (progreso <= 0) return null;

  const rutasOrdenadas = rutasChile.sort((a, b) => a.km - b.km);
  let rutaSeleccionada = null;
  for (let ruta of rutasOrdenadas) {
    if (progreso >= ruta.km) {
      rutaSeleccionada = ruta;
    }
  }
  return rutaSeleccionada;
}


export default function App() {
  return (
    <ProgressProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Inicio"
          screenOptions={{
            headerTransparent: true,
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 24,
              color: 'white',
            },
            headerTintColor: 'white',
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
    </ProgressProvider>
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
  frascoContainer: {
    width: 100,
    height: 250,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    marginTop: 20,
  },
  frascoFondo: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
  },
  frascoRelleno: {
    position: 'absolute',
    bottom: 0,
    width: '60%',
    backgroundColor: '#00BFFF', // color del líquido
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    zIndex: 0,
  },
  metaLinea: {
  position: 'absolute',
  top: 0,
  width: '100%',
  height: 4,
  backgroundColor: 'yellow',
  zIndex: 2,
  },
  porcentajeTexto: {
  position: 'absolute',
  color: 'white',
  fontWeight: 'bold',
  bottom: 10,
  zIndex: 3,
  },

});

