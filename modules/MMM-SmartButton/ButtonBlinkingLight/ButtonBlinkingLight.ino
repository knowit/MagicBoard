const int button1 = 4; //D4
const int buttonLight1 = 15; //D2 

const int button2 = 18; //D18
const int buttonLight2 = 5; //D5

const int button3 = 22; //D22
const int buttonLight3 = 23; //D2


int buttonState1 = 0;  
int buttonState2 = 0;  
int buttonState3 = 0;  

int time1 = 0;
int time2 = 0;
int time3 = 0;
boolean ligth1On = true;

const int timeDelay = 300;

void setup() {
  pinMode (buttonLight1, OUTPUT);
  pinMode(button1, INPUT);
  pinMode(button1, OUTPUT);
    
  pinMode(button2, INPUT);
  pinMode(button2, OUTPUT);
  pinMode(buttonLight2, OUTPUT);

  pinMode(button3, INPUT);
  pinMode(button3, OUTPUT);
  pinMode(buttonLight3, OUTPUT);
  
  Serial.begin(9600);

  digitalWrite(buttonLight1, LOW);


}

void loop() {
  
  buttonState1 = digitalRead(button1);
  buttonState2 = digitalRead(button2);
  
  

  if (buttonState1 == HIGH) {
    if (time1 == 0 || millis()-time1 > timeDelay){
      Serial.println("1");
      if(ligth1On){
        digitalWrite(buttonLight1, HIGH);  
      }
      else{
        digitalWrite(buttonLight1, LOW);
      }
      ligth1On = !ligth1On;
          
    }
    time1 = millis();
    
  }
  else {
  }


  buttonState2 = digitalRead(button2);
  if (buttonState2 == HIGH) {
    digitalWrite(buttonLight2, HIGH);

    if (time2 == 0 || millis()-time2 > timeDelay){
      Serial.println("2");
    }
    time2 = millis();
    
  }
  else {
    digitalWrite(buttonLight2, LOW);
  }

  buttonState3 = digitalRead(button3);
  if (buttonState3 == HIGH) {
    digitalWrite(buttonLight3, HIGH);

    if (time3 == 0 || millis()-time3 > timeDelay){
      Serial.println("3");
    }
    time3 = millis();
    
  }
  else {
    digitalWrite(buttonLight3, LOW);
  }

  
}
