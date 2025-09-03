import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function App() {
  const [mensagem, setMensagem] = useState('Inicializando o banco de dados...');
  const [db, setDb] = useState(null);

  useEffect(() => {
    async function setupDatabase() {
      try {
        const database = await SQLite.openDatabaseAsync('meu_banco.db');
        setDb(database);
        setMensagem('✅ Conexão com o banco de dados estabelecida.');
      } catch (error) {
        console.error('Erro ao conectar com o banco de dados:', error);
        setMensagem('❌ Erro ao conectar com o banco de dados.');
      }
    }
    setupDatabase();
  }, []);

  const criarTabela = async () => {
    if (!db) {
      setMensagem('❌ O banco de dados não está pronto.');
      Alert.alert('Erro', 'Banco de dados não foi inicializado.');
      return;
    }

    try {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS funcionarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          salario REAL NOT NULL,
          cargo TEXT NOT NULL
        );
      `);
      setMensagem('✅ Tabela "funcionarios" criada com sucesso!');
      Alert.alert('Sucesso', 'Tabela "funcionarios" criada!');
    } catch (error) {
      console.error('Erro ao criar tabela:', error);
      setMensagem('❌ Erro ao criar a tabela. Veja o log.');
      Alert.alert('Erro', 'Falha ao criar a tabela.');
    }
  };

  // cor dinâmica dependendo do status (✅, ❌ ou neutro)
  const statusColor =
    mensagem.startsWith('✅') ? styles.colors.success :
    mensagem.startsWith('❌') ? styles.colors.error :
    styles.colors.info;

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Criar Tabela no Banco de Dados</Text>

        <TouchableOpacity
          style={[styles.button, !db && styles.buttonDisabled]}
          onPress={criarTabela}
          activeOpacity={0.8}
          disabled={!db}
        >
          <Text style={[styles.buttonText, !db && styles.buttonTextDisabled]}>
            Criar Tabela Funcionários
          </Text>
        </TouchableOpacity>

        <Text style={[styles.statusText, { color: statusColor }]}>{mensagem}</Text>

        <Text style={styles.hint}>
          Pressione o botão para criar a tabela. A tabela só será criada se a conexão com o banco estiver ativa.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  colors: {
    success: '#16a34a', // verde
    error: '#dc2626',   // vermelho
    info: '#0ea5e9',    // azul claro
    background: '#f3f6fb',
    cardBg: '#ffffff',
    textPrimary: '#0b1220',
    muted: '#6b7280',
    buttonBg: '#2563eb', // azul botão
    buttonText: '#ffffff',
    disabledBg: '#cbd5e1',
  },
  screen: {
    flex: 1,
    backgroundColor: '#eef4fb',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 760,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: 'center',
    shadowColor: '#0b1724',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0b1220',
    marginBottom: 18,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#d1d5db',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonTextDisabled: {
    color: '#7b8794',
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  hint: {
    marginTop: 12,
    color: '#6b7280',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 620,
  },
});