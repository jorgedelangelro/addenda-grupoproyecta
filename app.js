let xmlOriginal = '';

const empresas = [
    'VALL', 'UOE', 'RATL', 'ILI', 'FOGG', 'CIEM',
    'BACM', 'BAC', 'CBR', 'F284', 'F336', 'F404',
    '1790', '744F', 'CSAN', 'F415', 'SEND', 'GCPR',
    'RIBE', 'CIN', 'F555', 'GML', 'UIGM', 'F6119',
    'F611', 'F510', 'F560', 'F115'
];

empresas.forEach(e => empresa.add(new Option(e, e)));

btnSiguiente.onclick = () => {
    
/*Mensaje de error*/
document.getElementById(
'mensajeAddenda'
).style.display = 'none';


    const f = xmlFile.files[0];

    if (!f) {
        return alert('Seleccione XML');
    }

    const r = new FileReader();

    r.onload = x => {
        
        xmlOriginal = x.target.result;

        const textoXML = xmlOriginal.toLowerCase();
 
if (
textoXML.includes("<cfdi:addenda") ||
textoXML.includes("<addenda")
) {
 
document.getElementById(
"mensajeAddenda"
).style.display = "block";
 
return;
}

        const d = new DOMParser().parseFromString(
            xmlOriginal,
            'text/xml'
        );

        const em = d.getElementsByTagNameNS('*', 'Emisor')[0];

        rfc.value = em?.getAttribute('Rfc') || '';
        nombre.value = em?.getAttribute('Nombre') || '';
        total.value = d.documentElement.getAttribute('Total') || '';

        paso1.style.display = 'none';
        paso2.style.display = 'block';
    };

    r.readAsText(f);
};

document
    .querySelectorAll('input[name=tipo]')
    .forEach(x => x.onchange = () => {

        const oc = document.querySelector(
            'input[value=OC]'
        ).checked;

        ocContainer.style.display = oc
            ? 'block'
            : 'none';

        rpiContainer.style.display = oc
            ? 'none'
            : 'block';
    });

function limpia(c) {
    c.addEventListener('input', function () {
        if (this.value.includes('-')) {
            this.value = this.value.split('-').pop();
        }
    });
}

setTimeout(() => {
    if (window.ordenCompra) {
        limpia(ordenCompra);
    }

    if (window.rpi) {
        limpia(rpi);
    }
}, 100);

btnNuevo.onclick = () => location.reload();

btnFinalizar.onclick = () => {

    let nd = '';

    if (
        document.querySelector('input[value=OC]').checked
    ) {
        nd = empresa.value + '-' + ordenCompra.value;
    } else {
        nd = 'RPI-' + rpi.value;
    }

    const add =
        '<cfdi:Addenda>' +
        '<acib2b>' +
        '<OrdenCompra ' +
        'RfcProv="' + rfc.value + '" ' +
        'NombreProv="' + nombre.value + '" ' +
        'NoOrdenCompra="' + nd + '" ' +
        'Total="' + total.value + '">' +
        '<Lineas NoLinea="1" Descripcion="' +
        descripcion.value +
        '"/>' +
        '</OrdenCompra>' +
        '</acib2b>' +
        '</cfdi:Addenda>';

    const out = xmlOriginal.replace(
        '</cfdi:Comprobante>',
        add + '</cfdi:Comprobante>'
    );

    const a = document.createElement('a');

    a.href = URL.createObjectURL(
        new Blob(
            [out],
            { type: 'text/xml' }
        )
    );

    a.download = 'ADDENDA_' + nd + '.xml';

    a.click();
};