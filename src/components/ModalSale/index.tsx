import React, {
  Dispatch, SetStateAction, useEffect, useState,
} from 'react';
import { AntDesign } from '@expo/vector-icons';
import {
  Modal, ScrollView, Text, TouchableOpacity, View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';
import Product from '../Product';
import { treatDate } from '../../utils/treats';
import { colors } from '../../styles.global';

interface IProduct{
  id: string
  unitaryValue: number
  discountUnitary: number
  amount: number
  userId: string
  productId: string
  saleId: string
  createdAt: string
  updatedAt: string
}

interface Sale{
  id: string
  payDate: string
  saleTotal: number
  discount: number
  userId: string
  confirmPay: boolean
  nameCliente: string
  salesProducts: IProduct[]
  createdAt: string
  updatedAt: string,
  partialPayment: boolean
  remainingAmount: number | null
  amountPaid: number | null
}

interface Props{
  visible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
  sale: Sale | undefined
}

const ModalSale: React.FC<Props> = ({ visible, setVisible, sale }: Props) => {
  const [saleDate, setSaleDate] = useState<string | null>();
  const [payDate, setPayDate] = useState<string | null>();

  useEffect(() => {
    if (sale?.createdAt) {
      setSaleDate(new Date(sale?.createdAt).toLocaleDateString());
    }

    if (sale?.payDate) {
      setPayDate(new Date(sale?.payDate).toLocaleDateString());
    }
  }, [sale]);

  return (
    <Modal
      animationType="slide"
      transparent
      style={styles.containerModal}
      visible={visible}
    >
      <LinearGradient
        colors={colors.backgroundLinear}
        style={styles.box}
      >

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setVisible(!visible)}
          style={styles.buttonClose}
        >
          <AntDesign name="closecircleo" size={30} color={colors.primaryFontColor} />
        </TouchableOpacity>

        <View style={styles.container}>
          <View
            style={styles.boxInfo}
          >
            <Text style={styles.textNameClient}>{sale?.nameCliente}</Text>
            <View style={styles.boxInfoSale}>
              <Text style={styles.textInfo}>{`Data da venda: ${treatDate(saleDate || '')}`}</Text>
              <Text style={styles.textPayment}>
                {`Pagamento: ${sale?.partialPayment ? 'Parcial' : sale?.confirmPay ? 'Pago' : 'Agendado'}`}
              </Text>

              {sale?.partialPayment ? (
                <View style={styles.boxPartial}>
                  <View style={styles.boxDate}>
                    <Text style={styles.payment}>{`Pago: R$ ${sale.amountPaid?.toFixed(2)}`}</Text>
                    <Text style={styles.date}>{`Data: ${treatDate(saleDate || '')}`}</Text>
                  </View>
                  <View style={styles.boxDate}>
                    <Text style={styles.payment}>{`Falta: R$ ${sale.remainingAmount?.toFixed(2)}`}</Text>
                    <Text style={styles.date}>{`Data: ${treatDate(payDate || '')}`}</Text>
                  </View>
                </View>
              ) : (
                <>
                  {sale?.confirmPay
                    ? (<Text style={styles.payment}>{`Data do Pagamento: ${treatDate(payDate || '')}`}</Text>)
                    : (<Text>{`Agendado para: ${treatDate(payDate || '')}`}</Text>)}
                </>
              )}

            </View>

          </View>
          <ScrollView style={{ width: '100%' }}>
            {sale ? (
              <>
                {sale.salesProducts.map((product) => (
                  <Product
                    key={product.id}
                    id={product.productId}
                    unitaryValue={product.unitaryValue}
                    amount={product.amount}
                    discount={product.discountUnitary}
                  />
                ))}
              </>
            ) : <></>}
          </ScrollView>

          <LinearGradient colors={colors.primaryColorLinear} style={styles.footer}>
            <Text style={styles.textSaleTotal}>{`R$ ${sale?.saleTotal.toFixed(2)}`}</Text>
            <Text style={styles.textDiscount}>{`Descontos: R$ ${sale?.discount.toFixed(2)}`}</Text>
          </LinearGradient>
        </View>
      </LinearGradient>
    </Modal>
  );
};

export default ModalSale;
