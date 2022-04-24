import React, { useContext, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { Portal, Title } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useProducts } from '../../../../hooks';
import { selectUser } from '../../../../redux/userSlice';
import ExchangeCard from './ExchangeCard';
import ExchangeDialog from './ExchangeDialog';
import Context from '../../../../context';
import { constants } from '../../../../utils';

export default () => {
    const user = useSelector(selectUser);
    const { allProducts, refreshAllProducts, isFetchingAllProducts } = useProducts();
    const { refreshSelfCoupons, showSnackbar } = useContext(Context);

    const [exchangeDialog, setExchangeDialog] = useState(false);
    const [exchangeProduct, setExchangeProduct] = useState({});

    const checkProductMatchSearchText = (product) => (
        !user.searchText
        || product.product_name.search(user.searchText) !== -1
        || product.description.search(user.searchText) !== -1
        || product.company_name.search(user.searchText) !== -1
        || product.company_address.search(user.searchText) !== -1
    );

    const passedCheckProducts = allProducts.filter(checkProductMatchSearchText);

    return (
        <>
            <Portal>
                <ExchangeDialog
                    visible={exchangeDialog}
                    close={() => {
                        setExchangeDialog(false);
                        setExchangeProduct({});
                    }}
                    product={exchangeProduct}
                    refreshAllProducts={refreshAllProducts}
                    refreshSelfCoupons={refreshSelfCoupons}
                    showSnackbar={showSnackbar}
                />
            </Portal>
            {
            !isFetchingAllProducts && !passedCheckProducts.length ? (
                <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有商品QQ</Title>
            ) : null
            }
            <FlatGrid
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                }}
                contentContainerStyle={{ paddingBottom: 70 }}
                refreshControl={(
                    <RefreshControl
                        refreshing={isFetchingAllProducts}
                        onRefresh={refreshAllProducts}
                    />
                )}
                itemDimension={constants.boxSize}
                data={isFetchingAllProducts ? [] : passedCheckProducts}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <ExchangeCard
                        product={item}
                        setExchangeDialog={setExchangeDialog}
                        setExchangeProduct={setExchangeProduct}
                    />
                )}
            />
        </>
    )
};