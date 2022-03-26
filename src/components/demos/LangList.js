import React, {useRef} from 'react';
import {
  Platform,
  ScrollView,
  View,
  Text,
  StyleSheet,
  findNodeHandle,
} from 'react-native';
import Style from '../../styles/Style';
import { isoLangs } from '../../utils/langs';
import FocusableHighlight from '../focusable/FocusableHighlight';

const ROWS = 5;
const ITEMS = 5;

const LangList = () => {
  const rowsRef = useRef(null);
  const rowRefs = useRef([]);

  function onItemFocus(e, row, item) {
    if (!rowRefs.current) {
      return;
    }
    if (row >= 0 && row < rowRefs.current.length) {
      // Check refs
      const rowRef = rowRefs.current[row];
      if (!rowRef || !rowsRef) {
        return;
      }
      // Get styles
      const rowsStyle = StyleSheet.flatten(styles.rows);
      const rowItemStyle = StyleSheet.flatten(styles.rowItem);
      // Get rows width / height
      const rowsWidth = rowsStyle.width;
      const rowsHeight = rowsStyle.height;
      // Get item width / height
      const itemWidth = rowItemStyle.width + rowItemStyle.margin * 5;
      const itemHeight = rowItemStyle.height + rowItemStyle.margin * 5;
      // Get horizontal offset for current item in current row
      const itemLeftOffset = itemWidth * item;
      // Get vertical offset for current row in rows
      const itemTopOffset = itemHeight * row;
      // Center item horizontally in row
      const rowsWidthHalf = rowsWidth / 2;
      if (itemLeftOffset >= rowsWidthHalf) {
        const x = itemLeftOffset - rowsWidthHalf + itemWidth / 2;
        rowRef.scrollTo({x: x, animated: true});
      } else {
        rowRef.scrollTo({x: 0, animated: true});
      }
      // Scroll vertically to current row
      const rowsHeightHalf = rowsHeight / 2;
      if (itemTopOffset >= rowsHeightHalf - itemHeight) {
        const y = itemTopOffset;
        rowsRef.current.scrollTo({y: y, animated: true});
      } else {
        rowsRef.current.scrollTo({y: 0, animated: true});
      }
    }
  }

  function showItems(row) {
    const items = Array.from( Object.keys(isoLangs));

    return items.map((item,i) => {
      const key = 'scrollview_item_' + row + '.' + item;
      return (
        <FocusableHighlight
          onPress={() => {}}
          onFocus={(e) => {
            onItemFocus(e, row, i);
          }}
          
          underlayColor={Style.buttonFocusedColor}
          style={styles.rowItem}
          nativeID={key}
          key={key}>
          <Text style={styles.text}>{isoLangs[item].name}</Text>
        </FocusableHighlight>
      );
    });
  }

  function showRow(row) {
    return (
      <ScrollView
        ref={(ref) => {
          rowRefs.current[row] = ref;
          if (Platform.OS === 'web') {
            let node = findNodeHandle(ref);
            if (node) {
              // Set ScrollView spatial navigation action as focus to avoid scroll on up
              node.style.setProperty('--spatial-navigation-action', 'focus');
            }
          }
        }}
        style={styles.row}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        nativeID={'scrollview_row_' + row}
        key={'scrollview_row_' + row}>
        {showItems(row)}
      </ScrollView>
    );
  }

  function showRows() {
    const rows = Array.from(Array(ROWS).keys());
    return rows.map((row) => {
      return showRow(row);
    });
  }

  return (
    <View style={Style.styles.content}>
       <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          alignSelf: 'flex-start',
          padding: 8,
        }}>
        Languages
      </Text>
      <ScrollView
        ref={rowsRef}
        style={styles.rows}
        nativeID={'rows'}
        showsVerticalScrollIndicator={false}>
        {showRows()}
      </ScrollView>
    </View>
  );
};

export default LangList;

const styles = StyleSheet.create({
  rows: {
    width: Style.px(1520),
    height: Style.px(780),
  },
  row: {
    width: '100%',
    height: Style.px(260),
  },
  rowItem: {
    width: Style.px(254),
    height: Style.px(210),
    margin: Style.px(10),
    backgroundColor: Style.buttonUnfocusedColor,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: Style.px(40),
  },
});
