import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, Modal } from 'react-native';
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
  const { progreso } = useProgress(); // 👈 acceso al dinero ahorrado
  const { setProgreso } = useProgress(); // <- Asegúrate de tener esto
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://192.168.1.42/ws');

    ws.current.onopen = () => {
      console.log('Conexión WebSocket abierta');
    };

    ws.current.onmessage = (event) => {
      console.log('Mensaje recibido:', event.data);
      try {
        const json = JSON.parse(event.data);
        const pesos = json.totalPesos ?? 0;
        setProgreso(pesos); // ✅ ya actualiza el progreso global
      } catch (e) {
        console.error('Error al parsear JSON:', e.message);
        setProgreso(0); // también puedes dejarlo en 0 si hubo error
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
        ws.current.send("reset");  // envía mensaje al ESP32
        setProgreso(0);            // opcionalmente actualizar localmente de inmediato
      } else {
        console.warn("WebSocket no está abierto");
      }
    };

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode='cover'>
        <View style={styles.overlay}>
          <Text style={styles.title}>Bienvenido a EduPiggy</Text>
          <Text style={styles.subtitle}>Tu alcancía inteligente de confianza.</Text>

          {/* Agrega aquí el dinero ahorrado */}
          <Text style={[styles.subtitle, { fontSize: 22, marginTop: 20 }]}>💰 Dinero ahorrado: ${progreso}</Text> 
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Resetear Dinero</Text>
          </TouchableOpacity>
        </View>

        
        <View style={styles.footerContainer}>
          <View style={styles.footer}>
            {/* Elimina botón de Dinero */}
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
    const [meta, setMeta] = useState(10000);  // Estado para meta editable
    const [modalVisible, setModalVisible] = useState(false);
    const [metaInput, setMetaInput] = useState('');
    const { progreso } = useProgress();
    const [edad, setEdad] = useState(null);

    useEffect(() => {
      const cargarMetaGuardada = async () => {
        try {
          const metaGuardada = await AsyncStorage.getItem('@meta_usuario');
          if (metaGuardada !== null) {
            setMeta(parseInt(metaGuardada));
          }
        } catch (e) {
          console.error("Error cargando meta guardada:", e);
        }
      };

      const obtenerEdad = async () => {
        try {
          const e = await AsyncStorage.getItem('@edad_usuario');
          if (e) setEdad(parseInt(e));
        } catch (err) {
          console.error("Error obteniendo edad:", err);
        }
      };

      cargarMetaGuardada();
      obtenerEdad();
    }, []);

    const metaNum = Number(meta) > 0 ? Number(meta) : 1;  

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

  const guardarMeta = async () => {
    if (!metaInput || isNaN(metaInput) || Number(metaInput) <= 0) {
      alert("Por favor ingresa un número válido mayor que 0.");
      return;
    }
    const metaNum = Number(metaInput);
    setMeta(metaNum);
    try {
      await AsyncStorage.setItem('@meta_usuario', metaInput);
      alert("Meta guardada correctamente.");
      setModalVisible(false);
      setMetaInput('');
    } catch (e) {
      console.error("Error guardando meta:", e);
      alert("Error guardando la meta.");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImageStats} style={styles.backgroundImage} resizeMode="cover">
        <View style={[styles.overlay, { justifyContent: 'flex-start', paddingTop: 100 }]}>
          
          <View style={styles.contenedor_analisis}>
            
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{
                backgroundColor: '#007BFF',
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 10,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
                elevation: 5,
                marginBottom: 15,
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>✏️ Escribir Meta</Text>
            </TouchableOpacity>


            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
                <View style={{
                  width: '80%',
                  backgroundColor: 'white',
                  borderRadius: 10,
                  padding: 20,
                  elevation: 10,
                }}>
                  <Text style={{ fontSize: 18, marginBottom: 10 }}>Ingrese nueva meta:</Text>
                  <TextInput
                    style={{
                      borderColor: '#ccc',
                      borderWidth: 1,
                      borderRadius: 5,
                      padding: 10,
                      fontSize: 16,
                      marginBottom: 20,
                    }}
                    keyboardType="numeric"
                    placeholder="Ej: 15000"
                    value={metaInput}
                    onChangeText={setMetaInput}
                  />

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(false);
                        setMetaInput('');
                      }}
                      style={{
                        backgroundColor: '#dc3545',
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderRadius: 5,
                      }}
                    >
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={guardarMeta}
                      style={{
                        backgroundColor: '#28a745',
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderRadius: 5,
                      }}
                    >
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>Guardar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            

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
  resetButton: {
    backgroundColor: '#d9534f',  // rojo
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 15,

    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,

    // Elevación para Android
    elevation: 6,
  },

  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});



