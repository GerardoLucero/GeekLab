using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO.Ports; // No olvidar.
using AForge.Video;
using AForge.Video.DirectShow;

namespace ControlArduino
{
    
    public partial class Form1 : Form
    {
        bool arduino = false;
        private bool ExisteDispositivo = false;
        private FilterInfoCollection DispositivoDeVideo;
        private VideoCaptureDevice FuenteDeVideo = null;

        public void CargarDispositivos(FilterInfoCollection Dispositivos)
        {
            for (int i = 0; i < Dispositivos.Count; i++) ;

            comboBox1.Items.Add(Dispositivos[0].Name.ToString());
            comboBox1.Text = comboBox1.Items[0].ToString();

        }

        public void BuscarDispositivos()
        {
            DispositivoDeVideo = new FilterInfoCollection(FilterCategory.VideoInputDevice);
            if (DispositivoDeVideo.Count == 0)
            {
                ExisteDispositivo = false;
            }

            else
            {
                ExisteDispositivo = true;
                CargarDispositivos(DispositivoDeVideo);

            }
        }

        public void TerminarFuenteDeVideo()
        {
            if (!(FuenteDeVideo == null))
                if (FuenteDeVideo.IsRunning)
                {
                    FuenteDeVideo.SignalToStop();
                    FuenteDeVideo = null;
                }

        }
        public  void Video_NuevoFrame( object sender, NewFrameEventArgs eventArgs)
        {
            Bitmap Imagen = (Bitmap)eventArgs.Frame.Clone();
            pictureBox1.Image = Imagen;

        }

        public Form1()
        {
            InitializeComponent();
            BuscarDispositivos();
            // Abrir puerto mientras se ejecuta esta aplicación.
            if (!serialPort1.IsOpen)
            {
                try
                {
                    serialPort1.Open();
                }
                catch (System.Exception ex)
                {
                    MessageBox.Show(ex.ToString());
                }
            }
        }

        private void button1_Click(object sender, EventArgs e)
        {
            arduino = !arduino;
            Color background;
            byte[] mBuffer;
            if (arduino){
                mBuffer = Encoding.ASCII.GetBytes("Led_ON");
                background = Color.Green;
            }
            else{
                mBuffer = Encoding.ASCII.GetBytes("Led_OFF");
                background = Color.Red;
            }

            button1.BackColor = background;
            serialPort1.Write(mBuffer, 0, mBuffer.Length);
        }

        private void label3_Click(object sender, EventArgs e)
        {

        }

        private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (ExisteDispositivo){
                FuenteDeVideo = new VideoCaptureDevice(DispositivoDeVideo[comboBox1.SelectedIndex].MonikerString);
                FuenteDeVideo.NewFrame += new NewFrameEventHandler(Video_NuevoFrame);
                FuenteDeVideo.Start();
                Estado.Text = "Ejecutando Dispositivo…";
                comboBox1.Enabled = false;
            }
            else
                Estado.Text = "Error: No se encuenta el Dispositivo";

            if (FuenteDeVideo.IsRunning){
                TerminarFuenteDeVideo();
                Estado.Text = "Dispositivo Detenido…";
                comboBox1.Enabled = true;

            }
        }
    }
}
