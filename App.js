import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

import CriarBanco from './screens/criarBancoDeDados';
import CriarTabela from './screens/criarTabela';
import InserirFuncionario from './screens/inserirFuncionarios';
import PesquisarFuncionarios from './screens/pesquisarFuncionarios';

const Drawer = createDrawerNavigator();

// Conteúdo customizado do Drawer com padding extra no iOS para evitar notch
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerScroll}>
      <View style={[styles.header, Platform.OS === 'ios' && styles.headerIosPadding]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>DB</Text>
        </View>
        <Text style={styles.appName}>TesteSQLite</Text>
        <Text style={styles.appSubtitle}>Banco local • SQLite</Text>
      </View>

      <View style={styles.items}>
        <DrawerItemList {...props} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Versão 1.0 • Dados locais</Text>
      </View>
    </DrawerContentScrollView>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Criar Banco"
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerStyle: { backgroundColor: '#0f1724' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '700' },

            drawerStyle: {
              backgroundColor: '#f8fafc',
              width: 300,
            },
            drawerActiveBackgroundColor: '#2563eb',
            drawerActiveTintColor: '#ffffff',
            drawerInactiveTintColor: '#0f1724',
            drawerLabelStyle: {
              marginLeft: -8,
              fontSize: 15,
              fontWeight: '600',
            },

            drawerType: 'slide',
            overlayColor: 'rgba(0,0,0,0.2)',
            sceneContainerStyle: { backgroundColor: '#f1f5f9' }
          }}
        >
          <Drawer.Screen name="Criar Banco" component={CriarBanco} />
          <Drawer.Screen name="Criar Tabela" component={CriarTabela} />
          <Drawer.Screen name="Inserir Funcionário" component={InserirFuncionario} />
          <Drawer.Screen name="Pesquisar Funcionários" component={PesquisarFuncionarios} />
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerScroll: {
    flex: 1,
    paddingTop: 0,
  },

  // header principal: agora com padding vertical controlado por Platform
  header: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
  },

  // padding extra para iPhones com notch
  headerIosPadding: {
    paddingTop: 34, // aumenta espaço superior no iOS para evitar notch
    paddingBottom: 16,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    // sombra sutil
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  avatarText: {
    color: '#2563eb',
    fontWeight: '800',
    fontSize: 22,
  },

  appName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },

  appSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginTop: 4,
  },

  items: {
    paddingHorizontal: 6,
    paddingTop: 8,
  },

  footer: {
    marginTop: 'auto',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderTopWidth: 1,
    borderTopColor: '#eef2ff',
  },

  footerText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
});