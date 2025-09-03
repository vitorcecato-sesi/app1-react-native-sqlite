import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function App() {
  // Estado para mostrar o status da conexão
  const [status, setStatus] = useState('Verificando conexão com o banco de dados...');

  // Executa ao iniciar o componente
  useEffect(() => {
    async function testarConexao() {
      try {
        // Abre (ou cria) o banco de dados local
        const db = await SQLite.openDatabaseAsync('meu_banco.db');
        // Executa um comando simples só para testar a conexão
        await db.execAsync('PRAGMA user_version;');
        setStatus('✅ Conexão com o banco de dados estabelecida com sucesso!');
      } catch (error) {
        // Se der erro, mostra mensagem de erro
        console.error('Erro na conexão:', error);
        setStatus('❌ Erro ao conectar com o banco de dados. Veja o log para mais detalhes.');
      }
    }
    testarConexao();
  }, []);

  // Define a cor do texto do status conforme o resultado
  const statusColor = status.startsWith('✅')
    ? styles.colors.success
    : status.startsWith('❌')
    ? styles.colors.error
    : styles.colors.info;

  // Interface do app
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Demonstração de SQLite</Text>
        <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
      </View>
    </View>
  );
}

// Estilos do app
const styles = StyleSheet.create({
  colors: {
    success: '#16a34a', // verde
    error: '#dc2626',   // vermelho
    info: '#0ea5e9',    // azul claro
    textPrimary: '#0f1724',
    muted: '#6b7280',
    background: '#f1f5f9',
    cardBg: '#ffffff'
  },
  container: {
    flex: 1,
    backgroundColor: '#eef2f7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 720,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 28,
    paddingHorizontal: 26,
    shadowColor: '#0b1724',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f1724',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 6,
  },
  hint: {
    marginTop: 12,
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
  },
});