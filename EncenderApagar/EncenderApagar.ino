int pinLed1 = 13;
char caracter;
String comando;
void setup()
{
  pinMode(pinLed1, OUTPUT);
  Serial.begin(115200);
}
void loop()
{
  
  while (Serial.available() > 0)
  {
       caracter= Serial.read();
       comando.concat(caracter);
       delay(10);
  }

  if (comando.equals("Led_ON") == true)
       {
            digitalWrite(pinLed1, HIGH); // Enciende el Led.
            Serial.println("Led 13 encendido.");
       }
  if (comando.equals("Led_OFF") == true)
       {
            digitalWrite(pinLed1, LOW); // Apaga el Led.
            Serial.println("Led 13 apagado.");
       } 
  
   comando="";
}

