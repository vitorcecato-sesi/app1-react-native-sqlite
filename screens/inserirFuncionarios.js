import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as SQLite from 'expo-sqlite';

let db = null;

// Abre o banco uma única vez e retorna a conexão (cache em `db`)
async function openDb() {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('meu_banco.db'); // abre/cria arquivo DB
  return db;
}

export default function App() {
  // campos do formulário
  const [nome, setNome] = useState('');
  const [salario, setSalario] = useState('');
  const [cargo, setCargo] = useState('');
  const [loading, setLoading] = useState(false); // controla estado de carregamento

  // Função que valida campos e insere o novo funcionário no banco
  const adicionarFuncionario = async () => {
    // validação simples
    if (!nome.trim() || !salario.trim() || !cargo.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);
      const conn = await openDb(); // obtém conexão
      // Insere usando parâmetros (evita SQL injection) — runAsync usado conforme API do exemplo
      await conn.runAsync(
        'INSERT INTO funcionarios (nome, salario, cargo) values (?, ?, ?);',
        [nome, parseFloat(salario), cargo]
      );

      Alert.alert('Sucesso', 'Funcionário adicionado com sucesso!');
      // limpa campos após inserção bem-sucedida
      setNome('');
      setSalario('');
      setCargo('');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao adicionar funcionário.');
      console.error('Erro ao inserir:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.title}>Adicionar Novo Funcionário</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome"
            placeholderTextColor="#A0A8B9"
            value={nome}
            onChangeText={setNome}
            returnKeyType="next"
          />
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, styles.inputHalf]}>
            <Text style={styles.label}>Salário</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#A0A8B9"
              keyboardType="numeric"
              value={salario}
              onChangeText={setSalario}
              returnKeyType="next"
            />
          </View>

          <View style={[styles.inputGroup, styles.inputHalf]}>
            <Text style={styles.label}>Cargo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: Analista"
              placeholderTextColor="#A0A8B9"
              value={cargo}
              onChangeText={setCargo}
              returnKeyType="done"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={adicionarFuncionario}
          activeOpacity={0.8}
          disabled={loading} // evita múltiplos envios
        >
          <Text style={styles.buttonText}>{loading ? 'Salvando...' : 'Adicionar Funcionário'}</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>Os dados serão salvos localmente no banco SQLite do aplicativo.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // paleta de cores usada no componente
  colors: {
    background: '#eef6ff',
    card: '#ffffff',
    primary: '#2563EB', // azul
    primaryDark: '#1e4ec8',
    accent: '#06b6d4', // ciano
    text: '#0f1724',
    muted: '#6b7280',
    success: '#16a34a'
  },

  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#eef6ff',
    alignItems: 'center',
    justifyContent: 'center'
  },

  card: {
    width: '100%',
    maxWidth: 780,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 26,
    paddingHorizontal: 22,
    shadowColor: '#0b1724',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 6,
    alignItems: 'stretch'
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f1724',
    marginBottom: 18,
    textAlign: 'center'
  },

  inputGroup: {
    marginBottom: 12
  },

  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  inputHalf: {
    width: '48%'
  },

  label: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 6,
    fontWeight: '600'
  },

  input: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6eefc',
    backgroundColor: '#fbfdff',
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#0f1724',
    shadowColor: '#0b1724',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 6
  },

  button: {
    marginTop: 12,
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 3
  },

  buttonDisabled: {
    backgroundColor: '#9fb3f6',
    shadowOpacity: 0.04
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  },

  hint: {
    marginTop: 14,
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center'
  }
});

