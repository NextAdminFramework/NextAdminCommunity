
namespace NextAdmin.UI {

    export class LanguageSelectorDropDown extends DropDownButton {

        options: LanguageSelectorDropDownButtonOptions;

        public static iconFr = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAABFCAYAAAAcjSspAAAACXBIWXMAABcSAAAXEgFnn9JSAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAABUPSURBVHja7Jx7rF3Vnd8/a639PK9777lPPzBge4x5WH4kxoChBJpMQgkdJcAfnSaplAdSJaZRRUejSFUURSPlLzpFiTQVojM0aaalJpM6aYaESSGG2IEiXBMbxuFhbOP39b3nntc++7XW6h/7nOt7TYzN4ApM8pN+2jrX2+fs/d3f9Vu/33f91hbWWn5vi80BOH78+LnPsE5xFAbIQWgQOWB+y3mqOFoHEABIpbHWOtbaDdbaa621a621K621K4Apa20dKAshALpCiFkhxAkhxGHgwOmK3Q+8PNFlD5CfeYQSZWGkJwFIFPQcRdMvPgc5KAuI5ILBWLJkyRlQ3smEFQs+UIBhTQEOYAVg1TwwFhesDzjjwG3GzN0C3CSE2NS/8TNfd9Zna20NqFlrrwBuAFjWskgLYHYDuxLHPmskT2cymwbIlQSrMEhA4msD1sHTBThaJf84plxk2wrcCdwBbDDGIIRACIFSat6llAgh8H0fay3WWowx8z74W97uDL53U9/vB/YATwA/AXZe7BsQ1tp3HD6uDInjGKkEYehiREYURQCUSiVybclSC9K/3RrvXimDe8bHnLEDb6TU6x7Vag+tNVJKPM/DcZz5m5ZSkuf5O16gGxtwXUg6oCxzR47iYKhcsYLOm2+ejoR+3KlUtzl+6alUQ6IlmXJIPA9rLUNp710PH/WNb3yDTqdzzhOzROO6LlIKer0ucdrD8zw8z8MYQ5pm64zmT40V3yyXah/LMlPa+cuX+Zvv/zc6nZSNG68oIoCUKKUQQixiw/lMxRmkKUhACf7PL3/J3//spwQ6p16vl0ZWr/yoTrNPtTrdSSGdE35YOZUjiLTGWkto9QWDUq1WL2z4KE8gHci1wQgXV5Xx3ApxZuh04i/7Qe0+6ajNpRBe+vVxHn74v/Dqq28Q+CVWX3UDjuMM4sX8cQAKgFLqHX8/GiljAJ8MNzf4R04x+z+e5Mgv9qEuv5wrPrKOyvUbJiuXr/h3tHq3dmbeejifHHsknyzT7Xapt7j4MWXwZAv6K6wRpGm6WirvT0ZGRu5XDvKVV47wV3/1X3nuuRcYGZlibGyM6VMzDOLJWcH0XV1gYrLi94XGNYIwDKnX60RRxIsvvsjeYweZfO1l1n/sVkau37K5MlL7yHS3vW5mJv726Ojo67S6Fx+UTtKkXC6jZJm0a8itf2vglx6whru6Hdj2+NM8/dQujp2aZnRsA+2oSyc2hNVlhEOXLQqig+A6AFtKed4LnIljwjDEExKiFm6jw5WR5SMiJEEye3yOmSO72P/r17nq1tep33abvPKqK/9N2SZXNl49/CDV0R0XHZQBvZMkwVrnj4aHS1/DsuVXvzrAkz99hp27XqBSHgUgTVNWrVrFqVOnOHjo0KJZZOCDmWgAymAYncvqpSoGEOTg+yil6Ha7tEyKlJKMjPpYnelOhx/84AesPXyYrV/5V9S2rr0rS+0E8C1g+7sB5byPKqz4pDomI73XDct/3myZLc8+c4DHt/2cH23/JVJNItUko2NXgRzhjQOnSbOQscmVtLr5IhDOBuiCgp8B1Uqg3QUDdT9kOAwpIXCymJojEXNzTCYZG0WIfW4fu//9QyR/+T9ZpqtbgD8H7r2oTNFak2XZH5UrQ19XuNc988zzPPqf/5aDB0+zatUaOj1NlmXMdTp4nke9XqfRaNBoNajX6/OALIwpA0DOx5Li96FS8XGFA+0mzWaTLMtwXR8hDak0WJ3jug5+WCVudjl06BDHduzgcgcmPvup64CvA+mFMsYpZhiNNTl5nuOoAGskJrd4bpWeLt0a9fKvDY8G1/3oh/v4Dw/9dyRVxi/bzEw7A+GQaoFfGSHN2rR7s3jlFCeJ6CZH0LaOwRaZrxQgBELIAhgpzssYpUFYmJExYc3DKENFaLpZhFKKzEp8GaBSAWmLsqdZ6cHQS/vgpX1MNE6jPv+56+g2v3a0Wplr18d3KOWj57oEVhKYLsiEnpf99uEzCISDwJhl2eqZmZkHVq8Otvzwh7t49NFHCcMQ3/eJ45gsyz7wxd3OnTt57bHHYGxsSxRFDxhjVnc6nfnAf06maG2xFoRQGC0wRmCRaO3+ydLLRu968mdvsu2xH9GYjQjKoyS5oFwuk6bvXFeoD0ABfmr/fjoGrli5kj/Y+NG7Zk7MvUml8tVG0qU84pGaIrnz87MCbZZl8wlVnudIKQmC4Muu694/N2d56KGHOHbsGEuXLkXrIsPNsmw+Mfsg2/DwMFEU8dhjj2FmZwmC4H6t9ZfDMDwn0wv+GJDCRRCQWw/lDq9T3vB9UezL//gXf00v8giCKaZP93CcGmW/RqvVwRiLEWAG1bMwHzhQlrshtenTVF56jf2PfI/y6YacOD1z3xKPdb3OSVInJXUMrpaLQRnUJYOj53lfaLfbm/fu3cuTTz7J6OjofEB0HIdGo0G1Wn1btvpBtFarhRCCarXK3r17OfzMMzAysjmKoi94nvcOTLESg4OxPlZWb09z8fnfvD7N327fQbmygpPTCbkOGR65jG5s6cZQqgz1GWILF4NBaYqvtaIvtry/JpMeSwUsiWPWzcUc/+GP4LXfUOk0Ph8E5vbEyUiUJZdiMSiDWKKLyvLeNGXy4MGD/OIXv2B4eJhOp0OlUmF2dpZer8fU1BRzc3PnLfs/CFar1ciyjDzPSZKEKIrY/Xd/B0NDk1EU3XtOpnheQOhVaDSSraP18J4Dh9r89aP/i4nl19DtSCqVCXqxRDohYXmIbtxDKIFyFVYYrDAYUeQTAMqAtCDs+x+IbZ6j05Rha5j0JOHMSd567lnyX+9meSm4Rxq9VWiLqtbezhSAIAju7HQYe+6550jT9JKIGReSkQdBMD8SwjAkSRL27t1LlmVjSqk7B0xaBEqeQZar8XKlfsexYxk///nz5KaKkCNofDQKLRS6HyaszLGi7zIvijV0IWz3tVJwzmi376PlRuH6FXKjyW1C2YWhdpuDTz+L98ZJVqTuHU5ixzuZXQyKEII4jm8LAjbs37+fAwcOEATBh4IpCytxIQRZluF5HseOHeON/ftRrrtBKXWb1noxKEEQkOXiljSDF/f8BkMJ111CnEmMNBhp5mPHgCHMe9Z3c6ZqsA7CSqTx3ndQlCiR9MB4AbkjSTpdlimXtZGi+exuOJlyeR7csrA2lv3cw/E876bjx9u88sor81plHMeXPFMWKoeDCl1KSbVa5cCBA3DiBI7n3SSldBaBEkXJhjAMN7326pu8dfQkfjBErhVIf5CFFFOLsAvyEt1f+xlksmbxApmVFyLX/H83k0DJrZBbSHLNcKmCafcYyQyjb7VJ970JPXeTY9WGRaC0Wq1rPU9x5MgRut0zmqbv+5c8U7IsIwiC+VysWq3S7XZJ05T51dFCS752ESijS1eubXZh1wsvMTG5FKQkzloIm6OMhzIeworCBwuFVoHxwVRBV4ujDYvpSaRY1cO4J997TLCFL+SdlgtcFD6owQbXN/h/NWUx7QaOMASux3RzjqBWJRMWr+pzYP8eyOaodqfXnp2nrIyihDiO0VpfkCL2YbEkSSBJkFKuXASKzu2K5lyHditC5wJjJFgPay79KdkKyBeENscU7mlwNaTtLjTbBEKtODtPmWo2m0RRNK+8na2tflgtiiLSVgul1NTZ0kG9201IE4OjymB8BAFShP1Z5NIdTqkqYs+gaB/EGsdAKQPVTUnn2gQ49bPyFMppmmKMwXGceab8rliv1wOlyos0WikgzyygcJSPMRJBf/hc4tgsDIvSFhV8kdUV/xYIhY3TRTlVP6bQHShrg8zvQrsCPgy1kdYahOguAkU5zNZqFfI8I88zXFdd0DrvpUEVWyTj/SFhpcD0cxuNxSpJUClDmswuAiVNOVGtVufjyQCQ35UmwVqtBnBiEShxnB+ujw4RhA5Z3kU5GmRS+CVunlm8/pSpwhMHIhcSX6KmxkilOXwWKPGBoaGQoaEh4jien30+NEPoHSwIAhgaIsuyA4szWpPs9wNYtnyMJGuhTYSQMULmi3WSSzGQmiJzFbao73NZtJfGDrR88JeMQtmjQ77/7OTtZSlhzZo1DDTb35U85fLLLx/oLi8vTt5cscfC7muuXUMQKoTKESrFmPTSnXT6EpBrCh/EFSOKeJIq6LmwbO1qkHa3Cd09ZytvubXsWrZsGb7vz3cf/C5Uy6WpKYBdruvmi0Dx5QzCHH12dDhi86YrMUmTNHJQwkOIHkL0kGgk+oyuYouWK0kMMgbRK7RaAOsjdIjMR9/zRZ8OEk77KUZoAguTHUU58VHaRxmwMsXKlFraKzzJqSU50kosksOTLV4dOsWEVNSampViCbWjPifNEM6m64muWcV0OXi2FxvO1lMAnh4eHt6zcePGRY17HwbzPI92u41SikajQalUIo5jrrvuOii6t59eFJwLyS4hSeJp5egnNm66hvpYgLUzKBkXVbJ1wfR9sCHBeoXmglOotkL21X6wQvdXDd/78CsZh5J18POizBVWkgtJ0s81EseQOIbYtX03xK4h8gqv9iSVSKAdl0w6NBzL0ZrCLh9j+eb1JEo+YYWZlmeDopTCGEOn0/nJ+Pjw6RtvvLFY9rgEOpXOG3CLjiyq1er8CmGe59xwww0wNHSaor+ftzGlHJYohy5Jb26nEunjd95xI0uXWKLe0aKcHCjzA2ZYH4vbd6fvAoPECIuRBq1yjHrvGXGQKcqJxM89MB5aSDIlC5YoSJQkcSy5NOTSkClNJovZJVUw2vWZTMp0tGCuEvAPbsbxNRMs/dRW2iX7eM8RO3Mp59fBFypv89VxkiTbVq8ePXn11Vd/KGKKUoowDJmbm0MpRRzHbNy4kWDp0pPAtt+a8AHkeU6cRDieRcreUzrNv/eHH7+ajeunkCJBUqwXC/Izyz8Dfd0qwCkyRgEIgxYGIzRG6Pd8U44GLEgjQQoSB7KBii/BNRpXFypaKYNKKgkziZ+Dnzko62NTj6haZb9vsVuuZfyu25itiO+1S8FTqZKkUp7Z7LUwpqRpShiGlEolms3md7duvfaFrVu3fihmn3a7zeTkJO12m+uvv57a6tUvRFH03XONhGKFME4ohRVMokl7TcphvvfUiemH77pjg9m8+QpqtZx26yCVkqZWgSRqILRGGgO2yF2k9M50VVNspxPivUsPpq+tpqq42qzfyKCswdMGP9bUjcuo8Qk7GqeVE2QOVVtCGZdjmaY1Nc6vui1WfOp2LvtnHzdZST3cUHJvJos4qYx8OyjnsEeA73zlK3+MlJJKpUKv12N6epqJiQlc1/1ArCC6rksURXS7XYIgYGRkBN/3yfOiWXpiYoLjx4+zZs0aPn733QilvnPo0KFHfN8/Z33XV5NchHURVqCsQZGiiFGi+e2Vl/Hjf/vVe6gP99DZUcZqhmbjMJWSptU4hTK2732l3JxRzC9GH22u+i4hR5NJgyRFYHCMwdNQkx6h6yO0pJloZrSm6/u0x8d4Xnc4vXENyz7zSdi49sevyezb2g2YGJogbaf4ucAxYtHa0Pmml9dbrezBTZuufP5LX/oStVqNTqdDrVbjxIkTVCqV950peZ7j+z5BEKC1Llb8+hbHMZ7n8ZnPfIYl69c/n83MPOg4zuv1ev0dO7X6fbTBvAsrEdYiyZBkuOrEDp3PfOuf3LJy37/8F7czXrdE7beoVwQlnz6rUpTNz7BEq/44fe8Z7WBtWIiCHYNdrhI9r7XOxV1O2JhetUJzapgDIyX2Dfm8MhGw6l//MeW7btrXW1L+1vGSs6MyNkYn03QPzzDlDhFkkiCTb++OPF9G6Lru9jiOv/nZz/7hvi9+8Yv4vk+apszMzHwg8pA8z+drtSiKaDabTE1N8elPf5qrb755H/DNXq+3fbBXKM9zKpXKObs7+5Ozms/oJMUTLnDTeIFlurGfZVNXbUuyPL35lnVfc737tvzlf/o+cdcjyQ3SgrQCaSTC6uLJWnD0e++OVH0lXtqCHcqaohq3BiMtqQAqAV3j0Mxijg+5eH+whqWf/Kcs//jHnm8q862jJt1uQh+sJO3ETLpDjIcV2o0Goe+hRZH7XDBTBt3Kc3NzdLvd7XGc/9knPrHqxw8++HXGx8c/EDHFcRzSNKXX67F69WruvvtuVt9884/R+s+MMdsHewiCIKBer5PnOe1Gg3N1XBdni2S+OVrP/7n/lLvgEqIFQIoTZDu6Tefo2Ih886HvfO7+7//NNvnEkzuYnm4zsfQKZme71IJxUgSpKmNyjUQgpeo3Qdl+nBBgLJxnGeWAn2AwrIksnDQ4WUA3DnHHJ4ttc07Oi0kTu2Yl6+76JFfettUcHx/+Tluab7tO+Hqpm1PVQA/oJYOBQWcE4ExQrmZvGz7v2l4HvgrsfeCBz923ftONmx97bDu7f72fXs+wbGmVRrNDFEXzexAXriEt3I57Pi3YxSEmBinBVZTLZYwxNJvNoievGrBlyxZWfeIWypvXv0C98vBhnTyS6XzROxfeVWlxvhOszBbMAznFPTggJMqmj/zm1RPPb/noqi9cc/X9n/+/u/9h8om//9+8tGcfJ946SDX454skzYVgXKj5NkHluih08pSXu7Ps9mOuWb2UFStWsP6WLVRXLjsppia+1xLmu43m7F7lhywJhxAIUtKLD8r5bGxsbG+vl/wpiCeuv379vVddu+6e1187OPaznz5FpVJh0J+6kBHvZqUgFCG5mxcvnSBj+fLl3H777WzZtB5/7drTjFYfp+JuQ9in8iwlCAKCSpU0szQajX9ULnXedx2I/qs27FkqWn+jC9papHQpl6r0ehlRL946Mb70zpMnp+9wHGfD+Ij3tm23C/cnn481UjhEUYyfJLgSstk50izaUx4deiJB/+RIe3anLPkI30dJH89IPO3g94pG4qh04ay84FeFXIjNzMxgNLhuiDFmZ5IkO8vl8l/EcXxbt9u9RQhxkxBi00JALlSr6UUZWZYRZtlu1+S7fMuz5Wr1aZPn0432HEOjQ3Tyol9PCoM2Eq0dfEpUq1Ui3br4TJnPSueZshj5WrXMzMwMQRDg+z5RFNFut3Ech+XLl3PyZBPAEUJsEEJcK4RYC6wUQqwApoQQdWDQMNMFZikWuw8DBxT+fmV52XPEnjiO827aQbgOJpDI0CdyLHmeY3ONLwMqOHiJRLYKoMSo/66ZIn7/+qFz1T6/t0X2/wYAYPSnRmRqwGAAAAAASUVORK5CYII=';

        public static iconEn = 'data:image/png;base64,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';

        public static iconDe = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAQ/SURBVHjavJc9rFRVEMd/c87Zu8vjPR48UYGCGCUxGEI0FBQWGENhjIkWRittLLDT1orWxEYTC2O0o9HKaKE2Ei3s/AhCIhg0iqAhfgXeE+7uPfO3uHv3+32A8M7m7M3szD3znzMz/3PWiqJgcmR3ghkCYoyEYFS9alHSEeBRd38IsRe0BBhmfwO/hBC+FToZLHweU/rTc8bdEZBiJLVatIoWkga+bC0AmGFwr6SXcs7PS9oOYGb1y337ZrlmYTNbNrMTMcbXJZ116eYAuHRc7sclWeN0o0NSDdTs1RDCKylGYkrrAzAzcs67JH3g7odv1PFMICGcSjE+VbTbP7WKFu4+0Acx+gHgPnc/fSucNwHJ/WC32/0uez44pU9FawQuS57zeaTt3ALnkzuBURbt9r4Y469NGkIrtWi1WrRSQu4ndRucD3dC7W5ZfpE9I3fcnYiE3Mk5H3f3Z+02OB8Fgdgh1xLwiVxYTAmkOyVdZhOHRbsHs58b+c1+O2/mfB/Anlnc1cm5XDZTRGzuiMVCeuuuvUcX80qUCWGb5jso808x/3S6mJcfW+51qUKY0TsjfDvKuVMJHdcJNQU300ZAS5llLT+eYq4OZQwf5XJsmuht0MuDxVV/Mdo5A5vp82FMriwQPD+QotjrzeEy2YI2o41sqLNRA2Ma/AybRnYgwM5ksI0JtAPimJSbiPtOGvI2GbKxHAztG1D9dMqGa5hsa7IRiJM7MBbNqF5DJ4PIZVO7ZrJh7o2JdNWpCu66Qj9SSXXUmii8pnhcY7syKTe/jXa7XGO1VL8DZiDxb/LABZzdYwuj6YrX8Kk++oHcvGsTqbTZehC4qAJ/BJG+GSv1KS6ob0ZTw5ndthuUJWHEs6l7gU/l6di4c41AsoFsIxmpS8xWbZpaa2OhjVOCqLCP7cKLu+eT+VUDNCgyjfbVuEy/klHdSJMABLIJAhm1UR+eGd2cdpgu3QFx+R1C+cIwiasw4C1jaoG3Pyw1/6Rd+WoPgd6eufDXxXpjwqqcO7qlbIyVZ+iFmVP64v2u4lxI7RI6dqkX516r+Zh6D2dMbeCQXdum7q6uz71bWTxH6GHXvt5WF5MCbVZ+MOvtE2mdOG7yEoLI2G/XvLOnkQPlFux6G5UdunnbEVm8buT1r1Y36Nr6hVVq6RFnAdiKmCdUbaPqBHJHdGNxqdTCYWEra4GYZL/13WeypVxqy8Oxl891co8iZ4qcCVABFWb1zMRTFXMHRXGmBqH/Ve0Bx4nnq9B+0Gl/megSKAl0+7MhIDX/9xywH3ssHsja+kZNNr6B+mf6AFGgovN2Zst+sNOBjPqZr59GWH0BgPbL0twBt+KEYyvWADGfom4DzNQHGkojvlfROVRa+5hBb7UA0lpRGI6IZ9DcczLf2aN6IiofNfl+8LvNtNA/2K46XJbi9yJ9FggfBVW/Y6G5a63KYv8NAIUgjhBr5taTAAAAAElFTkSuQmCC';

        public static iconEs = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAHvSURBVHjaxNe/S5VRHMfx13m4/RBTyowIHSpFg7IfQxAlhZBNTUFDtDYV1NLQUG4NDhHU0FBQS9AQ9AeEEkXUFqFgF4waKiEiQlH6Yfdp8NyIm+Y1732eNzzTc875fjjf8/0VXulWJatxGAexCx1oRcAnvMFLPMEQpqo5NFQhYDPO4QQ2Vin2M+7hGorLETCASyj4fwZxYakCNuE+9qsNL3Acryt/JPMs3oHRGhqHPRjBvsUErMMztKg9DXiK9n8JGMYa9SPBo4UEXMRu9acDV38/wjHdAhvwUbZsSXlbmDUrnQu1rLkcOBkmrx8olGZKk0oahIxMp3P5M2lMmgtNZ5r7BQ3yIHW0YPxHv/zoT2JhyYueBJ05CmhPsD5HAU1JrOe5kcTanRdTyXwlMkMmkthG5cVIwdYVQ4KzQsxQWVC2lRoO03d6V5Vm0sm0ZGWmmTiQNIaWMKpTKr2JUxlf/4MgHAtjuhDa8C5jAdtIi0kQBN4HBkN0TwbfrUAxCH91xUV01Tv00FZ+8pU9YR9+1llA35/xVingA3rxtU7Gj1ROSvPNBc/RE/v4WjEeG96H1Qwm5Q07caUGxm9g+0IZN1lk8/ko5Daml2D0G+5iL07j+3Km4zKt0YeHoovasDZG1pf4fkbxOF71RDWH/hoAYRJr3D62rwYAAAAASUVORK5CYII=';


        constructor(options?: LanguageSelectorDropDownButtonOptions) {
            super({
                languages: [
                    { code: 'en', label: 'English', iconUrl: LanguageSelectorDropDown.iconEn },
                    { code: 'fr', label: 'Français', iconUrl: LanguageSelectorDropDown.iconFr }
                ],
                languageChangedAction: (language?: string) => {
                    if (FrontApp) {
                        FrontApp.setCulture(language, true);
                    }
                },
                ...options
            } as LanguageSelectorDropDownButtonOptions);

            for (let language of this.options.languages) {
                this.addItem({
                    text: this.getLanguageItemContent(language),
                    action: () => {
                        this.setLanguage(language.code, true);
                    }
                });
            }
            if (FrontApp) {
                this.setLanguage(FrontApp.getLanguage());
            }
        }

        protected getLanguageItemContent(languageInfo?: LanguageInfo, caret?: boolean): string {
            return '<div style="display:flex;flex-direction:row"><img src="' + languageInfo.iconUrl + '" style="height:16px;margin-right:5px" /><div style="flex-grow:1">' + languageInfo.label + '</div>' + (caret ? '<div style="width:20px;padding-left:5px">' + NextAdmin.Resources.iconCaretDown + '</div>' : '') + '</div>';
            //return '<table style="min-width:100%"><tr><td style="display:flex;width:35px"><img src="' + languageInfo.iconUrl + '" style="height:20px;margin-right:5px" /></td><td>' + languageInfo.label + '</td>' + (caret ? '<td style="width:20px;padding-left:5px">' + NextAdmin.Resources.iconCaretDown + '</td>' : '') + '</tr></table>';
        }

        public getLanguageInfo(languageCode: string): LanguageInfo {
            return this.options.languages.firstOrDefault(a => a.code == languageCode);
        }

        public setLanguage(languageCode?: string, fireChanged?: boolean) {
            let languageInfo = this.getLanguageInfo(languageCode);
            this.setText(this.getLanguageItemContent(languageInfo, true));
            if (fireChanged) {
                this.options.languageChangedAction(languageCode);
            }
        }

    }

    export interface LanguageSelectorDropDownButtonOptions extends DropDownButtonOptions {

        languages?: Array<LanguageInfo>;

        languageChangedAction?: (language?: string) => void;

    }

    export enum LanguageSelectorSuportedLanguage {
        en = "en",
        fr = "fr",
        es = "es",
        de = 'de'
    }

    export interface LanguageInfo {

        code?: string;

        label?: string;

        iconUrl?: string;

    }
}