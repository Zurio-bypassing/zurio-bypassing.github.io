document.addEventListener('DOMContentLoaded', function() {
    // Selección de método de pago
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Manejo del formulario
    document.getElementById('checkout-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        const selectedPayment = document.querySelector('.payment-option.selected');
        if (!selectedPayment) {
            alert('Por favor, selecciona un método de pago');
            return;
        }

        const paymentMethod = selectedPayment.dataset.method;
        const email = document.getElementById('email').value;
        const discord = document.getElementById('discord').value;
        const planNombre = document.getElementById('plan-nombre').textContent;
        const planPrecio = document.getElementById('total-precio').textContent;

        // Crear el embed para Discord
        const webhookData = {
            embeds: [{
                title: "🛒 Nueva Orden de Compra",
                color: 0xb388ff,
                fields: [
                    {
                        name: "Producto",
                        value: planNombre,
                        inline: true
                    },
                    {
                        name: "Precio",
                        value: planPrecio,
                        inline: true
                    },
                    {
                        name: "Método de Pago",
                        value: paymentMethod,
                        inline: true
                    },
                    {
                        name: "Discord",
                        value: discord,
                        inline: true
                    },
                    {
                        name: "Email",
                        value: email,
                        inline: true
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: "Sistema de Pagos Zurio.bypassing"
                }
            }]
        };

        try {
            const response = await fetch('https://discord.com/api/webhooks/1307386565235835000/iPNSeSYy4T4OqVW0whJ6gmhecNLk-8iztdylvY4ufr3HOlKwOIkRWewYvNwYC1-_v502', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(webhookData)
            });

            if (response.ok) {
                // Simular redirección a la pasarela de pago
                alert('Redirigiendo a la pasarela de pago...');
                // Aquí puedes agregar la redirección real a tu pasarela de pago
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar el pago. Por favor, intenta nuevamente.');
        }
    });
}); 