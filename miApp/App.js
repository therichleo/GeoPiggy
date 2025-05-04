import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function App() {
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
      <Text style={styles.texto}>Botón presionado:</Text>
      <Text style={styles.contador}>{contador} veces</Text>
      <Button title="Resetear contador" onPress={handleReset} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  texto: { fontSize: 24 },
  contador: { fontSize: 48, margin: 20, fontWeight: 'bold' },
});
