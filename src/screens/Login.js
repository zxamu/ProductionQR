import { useState } from 'react';
import * as RN from 'react-native';
import appFirebase from '../config/fb';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth(appFirebase);

export default function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const logueo = async () => {
    try {
      setErrorMessage(''); // Limpiar mensaje anterior
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    } catch (error) {
      console.log(error.message);
      setErrorMessage('Correo o contraseña incorrectos. Intenta de nuevo.');
    }
  };

  return (
    <RN.View style={styles.padre}>
      <RN.View>
        <RN.Image source={{}} style={styles.logo} />
      </RN.View>

      <RN.View>
        <RN.Text style={styles.titleLogin}>Entra al portal</RN.Text>
        <RN.Text style={styles.descLogin}>Ingresa tu correo y contraseña</RN.Text>
        {errorMessage !== '' && (
          <RN.Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>
            {errorMessage}
          </RN.Text>
        )}
      </RN.View>

      <RN.View style={styles.card}>
        <RN.View style={styles.boxText}>
          <RN.TextInput
            placeholder='name@example.com'
            style={{ paddingHorizontal: 15 }}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={text => setEmail(text)}
          />
        </RN.View>
        <RN.View style={styles.boxText}>
          <RN.TextInput
            placeholder='Contraseña'
            style={{ paddingHorizontal: 15 }}
            onChangeText={text => setPassword(text)}
            secureTextEntry
          />
        </RN.View>
        <RN.View style={styles.mainButton}>
          <RN.TouchableOpacity style={styles.boxButton} onPress={logueo}>
            <RN.Text style={styles.textButton}>Entrar</RN.Text>
          </RN.TouchableOpacity>
        </RN.View>
      </RN.View>
    </RN.View>
  );
}

const styles = RN.StyleSheet.create({
  padre: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  logo: {
    width: 305,
    height: 100
  },
  card: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 10
  },
  boxText: {
    paddingVertical: 20,
    backgroundColor: '#cccccc40',
    borderRadius: 30,
    marginVertical: 10
  },
  mainButton: {
    alignItems: 'center'
  },
  boxButton: {
    backgroundColor: '#FFBB00',
    borderRadius: 30,
    paddingVertical: 20,
    width: 150,
    marginTop: 20
  },
  textButton: {
    textAlign: 'center'
  },
  titleLogin: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 40
  },
  descLogin: {
    textAlign: 'center'
  }
});